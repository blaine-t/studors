-- security so that studorsadmin has own db and they have limited perms

create role studorsadmin with login password 'password';

alter role studorsadmin createdb;

-- \q

-- psql -d postgres -U studorsadmin

create database studors;

-- \q

-- psql -d studors -U postgres

drop database postgres;

alter role studorsadmin nocreatedb;

-- \q

-- psql -d studors -U studorsadmin

create table students(
    id text primary key,
    first_name text default 'example',
    last_name text default 'student',
    picture text default 'https://studor.lps.org/img/defaultStudent.jpg',
    email text not null unique,
    grade int default -1,
    school text default 'LSW',
    dark_theme bool default false,
    phone text,
    pos text default 'student'
);

create table tutors(
    id text primary key,
    first_name text default 'example',
    last_name text default 'tutor',
    picture text default 'https://studor.lps.org/img/defaultTutor.jpg',
    email text not null unique,
    grade int default -1,
    school text default 'LSW',
    subjects text [] default '{}',
    availability date [] default '{}',
    hours_term float4 default 0,
    hours_total float4 default 0,
    dark_theme bool default false,
    phone text,
    pos text default 'tutor'
);

create table admins(
    id text primary key,
    api_key uuid default gen_random_uuid(),
    first_name text default 'example',
    last_name text default 'admin',
    picture text default 'https://studor.lps.org/img/defaultAdmin.jpg',
    email text not null unique,
    school text default 'LSW',
    dark_theme bool default false,
    phone text,
    pos text default 'admin'
);

create table sessions(
    id uuid primary key default gen_random_uuid(),
    subject text default 'other',
    timeof timestamp not null,
    student_id text references students(id) not null,
    tutor_id text references tutors(id) not null,
    school text default 'LSW',
    hours float
);

-- Create whitelist for admins and tutors so that only certain emails can sign up

create table allowedadmins( email text primary key );

create table allowedtutors( email text primary key );

create table allowedstudents( email text primary key );

drop table allowedstudents;

drop table allowedtutors;

drop table allowedadmins;

drop table sessions;

drop table admins;

drop table tutors;

drop table students;