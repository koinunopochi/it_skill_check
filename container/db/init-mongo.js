db.createUser({
  user: 'myappuser',
  pwd: 'myapppassword',
  roles: [
    {
      role: 'readWrite',
      db: 'myapp',
    },
  ],
});
