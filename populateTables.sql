insert into carts (id, user_id, created_at, updated_at)
values ('39ef58e2-6776-4aab-959d-93bb9c35b27e', '155f6b9e-1086-4d4f-b749-001b6902dadc', now(), now());

insert into cart_items (cart_id, count) values ('39ef58e2-6776-4aab-959d-93bb9c35b27e', 1);
insert into cart_items (cart_id, count) values ('39ef58e2-6776-4aab-959d-93bb9c35b27e', 3);
insert into cart_items (cart_id, count) values ('39ef58e2-6776-4aab-959d-93bb9c35b27e', 2);
