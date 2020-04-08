DROP TABLE IF EXISTS locations;
-- DROP TABLE IF EXISTS weather;
-- DROP TABLE IF EXISTS trails;

CREATE TABLE locations(
  id SERIAL PRIMARY KEY,
  search_query VARCHAR(255),
  formatted_query VARCHAR(255),
  latitude DECIMAL(9,7),
  longitude DECIMAL(9,7)
);

-- CREATE TABLE weather(
--   id SERIAL PRIMARY KEY,
--   search_query VARCHAR(255),
--   formatted_query VARCHAR(255),
--   latitude DECIMAL(9,7),
--   longitude DECIMAL(9,7)
-- );

-- CREATE TABLE trails(
--   id SERIAL PRIMARY KEY,
--   search_query VARCHAR(255),
--   formatted_query VARCHAR(255),
--   latitude DECIMAL(9,7),
--   longitude DECIMAL(9,7)
-- );