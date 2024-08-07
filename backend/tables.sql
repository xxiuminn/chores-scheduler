CREATE TABLE users (
	uuid			uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
	name 			VARCHAR(50) NOT NULL,
	email			VARCHAR(255) UNIQUE NOT NULL,
	hash		TEXT NOT NULL,
	image_url		TEXT,
	created_at		TIMESTAMP DEFAULT CURRENT_TIMESTAMP,			
	group_id		SMALLINT,
	membership VARCHAR(50),
	CONSTRAINT fk_users FOREIGN KEY(group_id) REFERENCES user_groups(id),
	CONSTRAINT fk_membershiptype FOREIGN KEY(membership) REFERENCES membership(types)
);

CREATE TABLE accounts (
	types			VARCHAR(50) UNIQUE NOT NULL PRIMARY KEY
);

CREATE TABLE user_groups (
	id				SMALLSERIAL PRIMARY KEY,
	name			VARCHAR(50) NOT NULL,
	created_at		TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	account_type	VARCHAR(50) NOT NULL,
	stripe_session_id TEXT,
	CONSTRAINT fk_type FOREIGN KEY(account_type) REFERENCES accounts(types)
);

CREATE TABLE task_groups (
	id SERIAL PRIMARY KEY,
	is_recurring	BOOLEAN NOT NULL,
	is_rotate BOOLEAN,
	rule VARCHAR(25),
	CONSTRAINT fk_recurrence FOREIGN KEY(rule) REFERENCES recurrence(rule)
)

CREATE TABLE recurrence (
	rule VARCHAR(25) UNIQUE PRIMARY KEY
)

INSERT INTO recurrence(rule) 
VALUES ('DAILY'),('WEEKLY')

CREATE TABLE tasks (
	id 						BIGSERIAL PRIMARY KEY,
	title					VARCHAR(50) NOT NULL,
	deadline			DATE NOT NULL,
	assigned_user	uuid NOT NULL,
	created_at		TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
	modified_at		TIMESTAMP,
	status			VARCHAR(50) DEFAULT 'IN PROGRESS' NOT NULL,
	created_by		uuid NOT NULL,
	last_modified_by		uuid,
	group_id			INT NOT NULL,

	CONSTRAINT fk_taskgroupid FOREIGN KEY(group_id) REFERENCES task_groups(id),
	CONSTRAINT fk_assigneduser FOREIGN KEY(assigned_user) REFERENCES users(uuid),
	CONSTRAINT fk_createdby FOREIGN KEY(created_by) REFERENCES users(uuid),
	CONSTRAINT fk_modifiedby FOREIGN KEY(last_modified_by) REFERENCES users(uuid)
)

CREATE TABLE status (
	types VARCHAR(25) UNIQUE PRIMARY KEY
)

INSERT INTO status(types)
VALUES ('COMPLETED'), ('IN PROGRESS')

CREATE TABLE membership(
	types VARCHAR(50) UNIQUE PRIMARY KEY
)

INSERT INTO membership(types)
VALUES ('INVITED'), ('ACTIVE')
;

INSERT INTO accounts(types) 
VALUES ('FREE'),('PAID');