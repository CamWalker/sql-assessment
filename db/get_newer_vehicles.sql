SELECT * FROM vehicles JOIN users ON vehicles.ownerid = users.id
	WHERE vehicles.year > 2000
    ORDER BY vehicles.year DESC;
