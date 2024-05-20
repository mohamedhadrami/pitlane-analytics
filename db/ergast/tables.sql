
DROP TABLE IF EXISTS circuits;

CREATE TABLE circuits (
  circuit_id SERIAL PRIMARY KEY,
  circuit_ref VARCHAR(255) NOT NULL DEFAULT '',
  name VARCHAR(255) NOT NULL DEFAULT '',
  location VARCHAR(255),
  country VARCHAR(255),
  lat FLOAT,
  lng FLOAT,
  alt INT,
  url VARCHAR(255) NOT NULL DEFAULT ''
);


DROP TABLE IF EXISTS constructor_results;

CREATE TABLE constructor_results (
  constructor_results_id SERIAL PRIMARY KEY,
  race_id INT NOT NULL DEFAULT '0',
  constructor_id INT NOT NULL DEFAULT '0',
  points FLOAT,
  status VARCHAR(255) DEFAULT NULL
);


DROP TABLE IF EXISTS constructor_standings;

CREATE TABLE constructor_standings (
  constructor_standings_id SERIAL PRIMARY KEY,
  raceId INT NOT NULL DEFAULT '0',
  constructorId INT NOT NULL DEFAULT '0',
  points FLOAT NOT NULL DEFAULT '0',
  position INT,
  positionText VARCHAR(255),
  wins INT NOT NULL DEFAULT '0'
);


DROP TABLE IF EXISTS constructors;

CREATE TABLE constructors (
  constructor_id SERIAL PRIMARY KEY,
  constructor_ref VARCHAR(255) NOT NULL DEFAULT '',
  name VARCHAR(255) NOT NULL DEFAULT '',
  nationality VARCHAR(255),
  url VARCHAR(255) NOT NULL DEFAULT ''
);


DROP TABLE IF EXISTS driver_standings;

CREATE TABLE driver_standings (
  driver_standings_id SERIAL PRIMARY KEY,
  race_id INT NOT NULL DEFAULT '0',
  driver_id INT NOT NULL DEFAULT '0',
  points FLOAT NOT NULL DEFAULT '0',
  position INT,
  position_text VARCHAR(255),
  wins INT NOT NULL DEFAULT '0'
);


DROP TABLE IF EXISTS drivers;

CREATE TABLE drivers (
  driver_id SERIAL PRIMARY KEY,
  driver_ref VARCHAR(255) NOT NULL DEFAULT '',
  number INT,
  code VARCHAR(3),
  forename VARCHAR(255) NOT NULL DEFAULT '',
  surname VARCHAR(255) NOT NULL DEFAULT '',
  dob DATE,
  nationality VARCHAR(255),
  url VARCHAR(255) NOT NULL DEFAULT ''
);


DROP TABLE IF EXISTS lap_times;

CREATE TABLE lap_times (
  race_id INT NOT NULL,
  driver_id INT NOT NULL,
  lap INT NOT NULL,
  position INT,
  time VARCHAR(255),
  milliseconds INT DEFAULT NULL
);


DROP TABLE IF EXISTS pit_stops;

CREATE TABLE pit_stops (
  race_id INT NOT NULL,
  driver_id INT NOT NULL,
  stop INT NOT NULL,
  lap INT NOT NULL,
  time time NOT NULL,
  duration VARCHAR(255),
  milliseconds INT DEFAULT NULL
);


DROP TABLE IF EXISTS qualifying;

CREATE TABLE qualifying (
  qualify_id SERIAL PRIMARY KEY,
  race_id INT NOT NULL DEFAULT '0',
  driver_id INT NOT NULL DEFAULT '0',
  constructor_id INT NOT NULL DEFAULT '0',
  number INT NOT NULL DEFAULT '0',
  position INT,
  q1 VARCHAR(255),
  q2 VARCHAR(255),
  q3 VARCHAR(255)
);


DROP TABLE IF EXISTS races;

CREATE TABLE races (
  race_id SERIAL PRIMARY KEY,
  year INT NOT NULL DEFAULT '0',
  round INT NOT NULL DEFAULT '0',
  circuit_id INT NOT NULL DEFAULT '0',
  name VARCHAR(255) NOT NULL DEFAULT '',
  date DATE DEFAULT NULL,
  time TIME,
  url VARCHAR(255),
  fp1_date DATE,
  fp1_time TIME,
  fp2_date DATE,
  fp2_time TIME,
  fp3_date DATE,
  fp3_time TIME,
  quali_date DATE,
  quali_time TIME,
  sprint_date DATE,
  sprint_time TIME
);


DROP TABLE IF EXISTS results;

CREATE TABLE results (
  result_id SERIAL PRIMARY KEY,
  race_id INT NOT NULL DEFAULT '0',
  driver_id INT NOT NULL DEFAULT '0',
  constructor_id INT NOT NULL DEFAULT '0',
  number INT,
  grid INT NOT NULL DEFAULT '0',
  position INT,
  position_text VARCHAR(255) NOT NULL DEFAULT '',
  position_order INT NOT NULL DEFAULT '0',
  points FLOAT NOT NULL DEFAULT '0',
  laps INT NOT NULL DEFAULT '0',
  time VARCHAR(255),
  milliseconds INT,
  fastest_lap INT,
  rank INT DEFAULT '0',
  fastest_lap_time VARCHAR(255),
  fastest_lap_speed VARCHAR(255),
  status_id INT NOT NULL DEFAULT '0'
);


DROP TABLE IF EXISTS seasons;

CREATE TABLE seasons (
  year INT NOT NULL DEFAULT '0',
  url VARCHAR(255) NOT NULL DEFAULT ''
);


DROP TABLE IF EXISTS sprint_results;

CREATE TABLE sprint_results (
  sprintResult_id SERIAL PRIMARY KEY,
  race_id INT NOT NULL DEFAULT '0',
  driver_id INT NOT NULL DEFAULT '0',
  constructor_id INT NOT NULL DEFAULT '0',
  number INT NOT NULL DEFAULT '0',
  grid INT NOT NULL DEFAULT '0',
  position INT,
  position_text VARCHAR(255) NOT NULL DEFAULT '',
  position_order INT NOT NULL DEFAULT '0',
  points FLOAT NOT NULL DEFAULT '0',
  laps INT NOT NULL DEFAULT '0',
  time VARCHAR(255),
  milliseconds INT,
  fastest_lap INT,
  fastest_lap_time VARCHAR(255),
  status_id INT NOT NULL DEFAULT '0'
);


DROP TABLE IF EXISTS status;

CREATE TABLE status (
  status_id SERIAL PRIMARY KEY,
  status VARCHAR(255) NOT NULL DEFAULT ''
);
