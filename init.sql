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

create table times( time timestamp with time zone primary key );

create table subjects( subject text primary key );

create table
    subjectmap(
        subject_id text references subjects(subject) ON delete cascade not null,
        tutor_id text references tutors(id) not null,
        primary key (subject_id, tutor_id)
    );

create table
    sessions(
        time_id timestamp
        with
            time zone references times(time) not null,
            subject_id text references subjects(subject) ON delete cascade not null,
            student_id text references students(id) not null,
            tutor_id text references tutors(id) not null,
            school text default 'LSW',
            hours decimal,
            primary key (time_id, tutor_id)
    );

create table increments( hour decimal primary key );

create table holidays ( holiday date primary key );

create table
    availabilitymap(
        time_id timestamp
        with
            time zone references times(time) not null,
            tutor_id text references tutors(id) not null,
            primary key (time_id, tutor_id)
    );

create table
    weeklyavailability(
        id uuid unique default gen_random_uuid(),
        dow int not null,
        increment_id decimal references increments(hour) ON delete cascade not null,
        primary key (dow, increment_id)
    );

create table
    weeklyavailabilitymap(
        weeklyavailability_id uuid references weeklyavailability(id) ON delete cascade not null,
        tutor_id text references tutors(id) not null,
        primary key (
            weeklyavailability_id,
            tutor_id
        )
    );

-- Create whitelist for users so that only certain emails can sign up

create table allowedadmins(email text primary key);

create table allowedtutors( email text primary key );

create table allowedstudents( email text primary key );