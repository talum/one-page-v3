---
layout: post
title: "The Ultimate Generating Migrations Checklist"
date: 2019-02-09T19:26:16-05:00
comments: true
categories: ["migrations", "schema"]
---

Maybe it's a little presumptuous to call this the "ultimate" checklist, but
I've noticed that in my own work I tend to overlook the same things over and over when
creating migrations, regardless of the complexity of the codebase, stack, or
domain. I'll get it right *eventually*, but it often takes a few
migrations in several PRs to get it correct.

With that in mind, I'm putting this
post together to remind myself of some points
to consider before pushing migrations to prod. By the way, this post
assumes that you self-manage a Postgresql database because that's
what I work with.

## 1. Sketch the domain.

Use diagrams to sketch the domain and to figure out what tables you need.
Using Google Docs is probably your best bet if you're working with a team and
anyone on that team should be able to update the document. The ability to
embed a linked Google Drawing in a Google Doc in which you share other technical
specifications is also a pro.

Sketch the tables and their columns and field types. Note where the foreign
keys live.

## 2. Add foreign key constraints.

In most cases, you want to guarantee referential integrity, right? If you
have one table that references another, you probably want to make sure that
a record cannot be inserted unless the referenced foreign key is present in the related
table.

For example, if you have a `cohort` that belongs to a `course_offering`, you
most likely want to make sure that the `course_offering` exists when you try
to insert the `cohort`.

You can accomplish this by using [foreign key
constraints](https://www.postgresql.org/docs/9.6/tutorial-fk.html).

Here's a code example in Elixir using Ecto:

```elixir

defmodule Registrar.Repo.Migrations.CreateCohortsTable do
  use Ecto.Migration

  def change do
    create table(:cohorts) do
      add :course_offering_id, references(:course_offerings), null: false

      timestamps()
    end
  end
end
```

The [references](https://hexdocs.pm/ecto_sql/Ecto.Migration.html#references/2) function allows you to generate the foreign key constraint.
Also note that I'm adding a `NOT NULL` constraint here by specifying `null: false`.

## 4. What about nulls?

Which brings me to the next point: which columns absolutely cannot be `null`? You should add a `NOT NULL` constraint. Most columns probably shouldn't have `null` values.

## 5. Are there any default values?

If the column can't be `null`, is there a [default value](https://www.postgresql.org/docs/9.3/ddl-default.html) you can assign?

## 6. Add timestamps.

You can almost never go wrong with timestamps for `inserted_at` and `updated_at`. So make sure you add them.

## 7. Verify uniqueness.

Requiring uniqueness leads to a host of other questions.

If your fields need to be unique, you

1. probably need to use unique constraints or indexes
2. need to switch any columns of type "string" to "citext".

### On Unique Constraints & Indexes

[Unique
constraints](https://www.postgresql.org/docs/9.4/ddl-constraints.html)
ensure that the data will be unique in a column or group of columns. For
reference, unique constraints are implemented using
[indexes](https://www.postgresql.org/docs/9.4/indexes-unique.html). So, if
you're using a framework to generate your migrations, you can probably go
with creating indexes and achieve the same result.

If you want to guarantee uniqueness of a combination of keys, you can create
a compound index by specifying the columns the index should include.

Here's an example in the Phoenix framework, which uses the Ecto library:

```elixir
defmodule Registrar.Repo.Migrations.CreateCourseOfferingsTable do
  use Ecto.Migration

  def change do

    create table(:course_offerings) do
      add :pace_id, references(:paces), null: false
      add :course_id, references(:courses), null: false
      add :campus_id, references(:campuses), null: false
      add :name, :citext

      timestamps()
    end

    create index(:course_offerings, :pace_id)
    create index(:course_offerings, :course_id)
    create index(:course_offerings, :campus_id)
    create unique_index(:course_offerings, :name)
    create unique_index(:course_offerings, [:pace_id, :course_id, :campus_id], name: :course_offering_configuration_index)
  end
end

```

### On Null Values With Indexes
Regarding `null` values, because you're probably wondering what happens when `null` is allowed but you have a unique index on that column, "Null values are not considered equal" according to [Postgresql Unique Indexes Docs](https://www.postgresql.org/docs/9.4/indexes-unique.html). So don't worry about `nulls` at the database level, unless you've explicitly disallowed them with a `NOT NULL` index (like [this](https://www.postgresql.org/docs/9.4/ddl-constraints.html)). In application code, sometimes you'll have to explicitly allow `nil` though, with a uniqueness validation. So although null values will be permitted in the database, they may not pass the model-level validation check. For example, in [Rails](https://guides.rubyonrails.org/active_record_validations.html#allow-nil), you would likely have code like this if you wanted to validate the uniqueness of an attribute that was not required:

```ruby
class SalesforceOpportunity < ActiveRecord::Base
  validates :user_id, presence: true
  validates :external_id, uniqueness: true, allow_nil: true
end
```
### On String Uniqueness

When it comes to guaranteeing string uniqueness from user input fields, there's one more thing you should probably consider: citext fields. [Citext](https://www.postgresql.org/docs/9.1/citext.html) is a module that you need to enable that allows you to store strings as case-insensitive text. So instead of having to compare text and explicitly cast it for persistence, you can delegate that to the database layer. It's real dope.

If you haven't enabled the extension before, you'll have to do so before using the field type for the first time:

```elixir
defmodule Registrar.Repo.Migrations.EnableCitextExtension do
  use Ecto.Migration

  def change do
    execute "CREATE EXTENSION IF NOT EXISTS citext;"
  end
end
```
After that, you can start using the field type in your migrations.

Note: Also, when you're accepting user input, you should be sure to strip the input of leading and trailing whitespace.

## 8. Do your records need to communicate with external services? Use UUIDs.

If your records need to communicate with external services, you should consider creating a different type of identifier for it that can be synced across the services. You would probably not want to send a primary key anywhere else because it's pretty useless, non-unique, and uninformative. Instead, use a UUID, or a "universally unique identifier". That's not something you generate by yourself in code (I've been there before, not what it is.) In Postgresql, it's a whole other [data type](https://www.postgresql.org/docs/9.1/datatype-uuid.html). You can enable it with the [`uuid-ossp` module](https://www.postgresql.org/docs/9.5/uuid-ossp.html) and you'll have to do so before using it for the first time.

```elixir
defmodule Registrar.Repo.Migrations.AddCitextUuidDropNames do
  use Ecto.Migration

  def change do
    execute("CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";")

    alter table(:cohorts) do
      add :cohort_uuid, :uuid, default: fragment("uuid_generate_v4()")
    end
  end
end
```

By providing the default value for the `cohort_uuid` field with field type `uuid`, we're entrusting the module to handle generating the UUIDs instead of creating it in code.

More on [UUIDs](https://en.wikipedia.org/wiki/Universally_unique_identifier) on Wikipedia.

## 9. Add other indexes for faster lookup.
Depending on the anticipated size of your table and how often you plan on querying it, you could benefit from creating indexes on the fields you're searching by. Remember that adding indexes will slow down writes, but provide faster reads. You can indeed [index on dates](https://devcenter.heroku.com/articles/postgresql-indexes) by the way. Read more [here](https://www.postgresql.org/docs/9.1/sql-createindex.html).

## 10. Dropping tables and columns.
Dropping tables or columns on active tables can be pretty tricky. In general, the best practice is to first remove all the code references to it, and then follow up with a migration to drop the tables. This has bitten my team multiple times because of our particular deployment scheme in which our staging and production environments for our monolith share the same database. So the migrations get run on the staging box before the accompanying code makes it to production, which causes a 500 on prod pretty much everywhere. So, as tempting as it is to remove code and tables in one fell swoop, don't do it.

You might want to ask your ops team to generate a backup just in case something terrible goes wrong. But in my experience so far, if you're dropping tables, you probably just don't need it so take the Kondo approach and say "thank you" and discard it.

### References
- [Unique constraints](https://www.postgresql.org/docs/9.4/ddl-constraints.html)
- [Unique indexes](https://devcenter.heroku.com/articles/postgresql-indexes)
- [Citext fields](https://www.postgresql.org/docs/9.1/citext.html)
- [UUID type](https://www.postgresql.org/docs/9.1/datatype-uuid.html)
- [UUID-OSSP module](https://devcenter.heroku.com/articles/postgresql-indexes)
- [UUIDs Wikipedia](https://en.wikipedia.org/wiki/Universally_unique_identifier)
- [Heroku on Postgresql Indexes](https://devcenter.heroku.com/articles/postgresql-indexes)
- [Create Index](https://www.postgresql.org/docs/9.1/sql-createindex.html)
- [Rails allow_nil](https://guides.rubyonrails.org/active_record_validations.html#allow-nil)
- [Foreign key constraints](https://www.postgresql.org/docs/9.6/tutorial-fk.html)
- [Ecto References](https://hexdocs.pm/ecto_sql/Ecto.Migration.html#references/2)
