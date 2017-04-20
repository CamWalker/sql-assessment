SELECT * FROM vehicles JOIN users ON vehicles.ownerid = users.id
	WHERE users.email LIKE $1 AND users.firstname LIKE $2;
