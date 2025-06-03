-- ========================
-- EXTENSIONES REQUERIDAS
-- ========================
create extension if not exists "uuid-ossp";

-- ========================
-- 🧍‍♂️ TABLA JUGADORES
-- ========================
drop table if exists jugadores cascade;

create table jugadores (
  uid uuid primary key,
  nombre text not null,
  apellido text not null,
  email text not null unique,
  password text,
  gameId text not null,
  subCodigo text not null,
  equipo text,
  fotoURL text,
  tickets integer default 0,
  rol text default 'usuario',
  creado timestamp default now()
);

alter table jugadores enable row level security;

-- Políticas RLS seguras
create policy "insertar propio perfil"
on jugadores
for insert
with check (auth.uid() = uid);

create policy "leer tu propio perfil"
on jugadores
for select
using (auth.uid() = uid);

create policy "actualizar tu propio perfil"
on jugadores
for update
using (auth.uid() = uid);

-- ========================
-- 🤝 TABLA EQUIPOS
-- ========================
drop table if exists equipos cascade;

create table equipos (
  id uuid primary key default uuid_generate_v4(),
  nombre text not null unique,
  descripcion text,
  logoURL text,
  creadorUID uuid not null,
  integrantes jsonb default '[]',
  ticketsEquipo integer default 0,
  victorias integer default 0,
  derrotas integer default 0,
  empates integer default 0,
  creado timestamp default now()
);

alter table equipos enable row level security;

create policy "insertar equipos siendo creador"
on equipos
for insert
with check (auth.uid() = creadorUID);

create policy "leer equipos"
on equipos
for select
using (true);

create policy "modificar si sos el creador"
on equipos
for update
using (auth.uid() = creadorUID);

-- ========================
-- 🏆 TABLA TORNEOS
-- ========================
drop table if exists torneos cascade;

create table torneos (
  id uuid primary key default uuid_generate_v4(),
  nombre text not null,
  juego text not null,
  fecha timestamp not null,
  estado text default 'abierto',
  jugadoresPorEquipo integer not null,
  equiposTotales integer not null,
  ticketsPorJugador integer not null,
  equiposInscritos jsonb default '[]',
  creado timestamp default now()
);

alter table torneos enable row level security;

create policy "lectura libre"
on torneos
for select
using (true);

create policy "crear torneo (authenticated)"
on torneos
for insert
with check (auth.role() = 'authenticated');

create policy "actualizar torneos (admins luego)"
on torneos
for update
using (auth.role() = 'authenticated');

-- ========================
-- 📰 TABLA NOTICIAS
-- ========================
drop table if exists noticias cascade;

create table noticias (
  id uuid primary key default uuid_generate_v4(),
  titulo text not null,
  contenido text not null,
  autor text not null,
  fecha timestamp default now(),
  imagenes jsonb default '[]'
);

alter table noticias enable row level security;

create policy "lectura libre"
on noticias
for select
using (true);

create policy "crear noticia (usuarios)"
on noticias
for insert
with check (auth.role() = 'authenticated');

-- ========================
-- 🛡️ AJUSTES DE SEGURIDAD
-- ========================
-- Asegurarse que solo los usuarios autenticados puedan usar insert/update
alter table jugadores force row level security;
alter table equipos force row level security;
alter table torneos force row level security;
alter table noticias force row level security;

-- ========================
-- 🔁 CREACIÓN AUTOMÁTICA EN JUGADORES
-- ========================

-- Función que inserta automáticamente el perfil del jugador al crearse un usuario
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.jugadores (uid, email, nombre, apellido)
  values (new.id, new.email, 'SinNombre', 'SinApellido');
  return new;
end;
$$ language plpgsql security definer;

-- Eliminar trigger previo si existe para evitar duplicaciones
drop trigger if exists on_auth_user_created on auth.users;

-- Crear trigger para ejecutar la función al crearse un nuevo usuario
create trigger on_auth_user_created
after insert on auth.users
for each row
execute procedure public.handle_new_user();
