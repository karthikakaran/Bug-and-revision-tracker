CREATE TABLE issue_db.revisions (
  rev_id VARCHAR(100),
  issue_id INT(6) UNSIGNED NOT NULL,
  FOREIGN KEY (issue_id) REFERENCES issue_db.issues(id),
  updated_issue JSON NOT NULL,
  changes JSON NOT NULL,
  updated_by VARCHAR(100) NOT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT now(),
  PRIMARY KEY (rev_id, issue_id)
);