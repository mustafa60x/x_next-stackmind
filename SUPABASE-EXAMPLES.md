

## Create Users Table
```sql
CREATE TABLE users (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

------------------------------------------------------------------

## Create Posts Table
```sql
CREATE TABLE posts (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    user_id BIGINT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

------------------------------------------------------------------

## Create Comments Table
```sql
CREATE TABLE comments (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    content TEXT NOT NULL,
    post_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

------------------------------------------------------------------

## Create csrf_tokens Table
```sql
CREATE TABLE csrf_tokens (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id BIGINT,
    token TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
);
```

------------------------------------------------------------------

### Açıklamalar

`id`: Otomatik artan bir birincil anahtar (primary key). GENERATED ALWAYS AS IDENTITY ile her yeni kullanıcıya benzersiz bir ID atanır.
`email`: Kullanıcının e-posta adresi. NOT NULL ve UNIQUE ile boş olamaz ve her e-posta yalnızca bir kez kullanılabilir.
`username`: Kullanıcı adı. Yine NOT NULL ve UNIQUE ile benzersiz olmalı.
`password`: Şifre alanı. Şifreyi düz metin olarak saklamak yerine, gerçek uygulamada hash'lenmiş haliyle saklaman önerilir (örneğin, Supabase Authentication kullanıyorsan bu otomatik yapılır).
`created_at`: Kullanıcının kayıt zamanı. Varsayılan olarak mevcut zaman damgasını alır.


## SQL Examples

### Insert a new user
```sql
INSERT INTO users (email, username, password)
VALUES ('user@example.com', 'username', 'password');
```

### Select all users
```sql
SELECT * FROM users;
```

### Update a user
```sql
UPDATE users
SET email = 'newemail@example.com'
WHERE id = 1;
```

### Delete a user
```sql
DELETE FROM users
WHERE id = 1;
```

### Select a user by username
```sql
SELECT * FROM users WHERE username = 'username';
```

------------------------------------------------------------------

## Supabase-js Examples

### Create users table
```ts
const { data, error } = await supabase
  .from('users')
  .insert([
    {
      email: 'user@example.com',
      username: 'username',
      password: 'password'
    }
  ])
  .select()
  .single();
```

### Select all users
```ts
const { data, error } = await supabase
  .from('users')
  .select();
```

### Update a user
```ts
const { data, error } = await supabase
  .from('users')
  .update({
    email: 'newemail@example.com'
  })
  .eq('id', 1);
```

### Delete a user
```ts
const { data, error } = await supabase
  .from('users')
  .delete()
  .eq('id', 1);
```

### Select a user by username
```ts
const { data, error } = await supabase
  .from('users')
  .select()
  .eq('username', 'username');
```

### Insert and select a new user
```ts
const { data, error } = await supabase
  .from('users')
  .insert([
    {
      email: 'user@example.com',
      username: 'username',
      password: 'password'
    }
  ])
  .select()
  .single();
```
