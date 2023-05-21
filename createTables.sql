create table carts (
 	id uuid primary key default uuid_generate_v4(),
 	user_id uuid not null,
 	created_at date not null default current_timestamp,
 	updated_at date not null default current_timestamp,
 	status cart_status
);

create table cart_items (
 	cart_id uuid,
 	product_id uuid default uuid_generate_v4(),
 	count integer,
	foreign key(cart_id) references carts(id) on delete cascade
);
