create table
    students(
        id text primary key,
        first_name text default 'example',
        last_name text default 'student',
        picture text default 'https://studors.lps.org/img/defaultStudent.jpg',
        email text not null unique,
        grade int default -1,
        school text default 'LSW',
        dark_theme bool default false,
        phone text,
        pos text default 'student'
    );

create table
    tutors(
        id text primary key,
        first_name text default 'example',
        last_name text default 'tutor',
        picture text default 'https://studors.lps.org/img/defaultTutor.jpg',
        email text not null unique,
        grade int default -1,
        school text default 'LSW',
        hours_term decimal default 0,
        hours_total decimal default 0,
        dark_theme bool default false,
        phone text,
        pos text default 'tutor'
    );

create table
    admins(
        id text primary key,
        api_key uuid default gen_random_uuid(),
        first_name text default 'example',
        last_name text default 'admin',
        picture text default 'https://studors.lps.org/img/defaultAdmin.jpg',
        email text not null unique,
        grade int default -1,
        school text default 'LSW',
        dark_theme bool default false,
        phone text,
        pos text default 'admin'
    );

create table
    sessions(
        id uuid primary key default gen_random_uuid(),
        time_id timestamp
        with
            time zone references times(time) not null,
            subject_id text references subjects(subject) not null,
            student_id text references students(id) not null,
            tutor_id text references tutors(id) not null,
            school text default 'LSW',
            hours decimal
    );

create table subjects( subject text primary key );

create table
    subjectmap(
        id uuid primary key default gen_random_uuid(),
        subject_id text references subjects(subject) not null,
        tutor_id text references tutors(id) not null
    );

create table times( time timestamp with time zone primary key );

create table
    increments(
        increment uuid primary key default gen_random_uuid(),
        hour int not null,
        minute int not null
    );

create table
    availabilitymap(
        id uuid primary key default gen_random_uuid(),
        time_id timestamp
        with
            time zone references times(time) not null,
            tutor_id text references tutors(id) not null
    );

-- Create whitelist for users so that only certain emails can sign up

create table allowedadmins(email text primary key);

create table allowedtutors( email text primary key );

create table allowedstudents( email text primary key );