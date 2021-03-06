exports.up = knex =>
  knex.schema
    .createTableIfNotExists('moods', table => {
      table.increments('id').primary();
      table.text('uri').notNullable();
    })
    .then(() =>
      knex('moods').insert([
        {
          uri:
            'https://s3.eu-west-2.amazonaws.com/friendship-app/moods/angel.png',
        },
        {
          uri:
            'https://s3.eu-west-2.amazonaws.com/friendship-app/moods/crying.png',
        },
        {
          uri:
            'https://s3.eu-west-2.amazonaws.com/friendship-app/moods/disappointed.png',
        },
        {
          uri:
            'https://s3.eu-west-2.amazonaws.com/friendship-app/moods/dizzy.png',
        },
        {
          uri:
            'https://s3.eu-west-2.amazonaws.com/friendship-app/moods/doubtful.png',
        },
        {
          uri:
            'https://s3.eu-west-2.amazonaws.com/friendship-app/moods/dreaming.png',
        },
        {
          uri:
            'https://s3.eu-west-2.amazonaws.com/friendship-app/moods/grinning.png',
        },
        {
          uri:
            'https://s3.eu-west-2.amazonaws.com/friendship-app/moods/in-love.png',
        },
        {
          uri:
            'https://s3.eu-west-2.amazonaws.com/friendship-app/moods/love-kiss.png',
        },
        {
          uri:
            'https://s3.eu-west-2.amazonaws.com/friendship-app/moods/no-mouth.png',
        },
        {
          uri:
            'https://s3.eu-west-2.amazonaws.com/friendship-app/moods/rolling-eyes.png',
        },
        {
          uri:
            'https://s3.eu-west-2.amazonaws.com/friendship-app/moods/sleeping.png',
        },
        {
          uri:
            'https://s3.eu-west-2.amazonaws.com/friendship-app/moods/smiling-devil.png',
        },
        {
          uri:
            'https://s3.eu-west-2.amazonaws.com/friendship-app/moods/smiling.png',
        },
        {
          uri:
            'https://s3.eu-west-2.amazonaws.com/friendship-app/moods/straight-face.png',
        },
        {
          uri:
            'https://s3.eu-west-2.amazonaws.com/friendship-app/moods/surprised.png',
        },
        {
          uri:
            'https://s3.eu-west-2.amazonaws.com/friendship-app/moods/thinking.png',
        },
        {
          uri:
            'https://s3.eu-west-2.amazonaws.com/friendship-app/moods/tired.png',
        },
        {
          uri:
            'https://s3.eu-west-2.amazonaws.com/friendship-app/moods/upside-down-smile.png',
        },
        {
          uri:
            'https://s3.eu-west-2.amazonaws.com/friendship-app/moods/winking.png',
        },
      ]),
    )
    .then(() =>
      knex.schema.alterTable('users', t => {
        t.dropColumn('avatar');
        t.string('mood').defaultTo(
          'https://s3.eu-west-2.amazonaws.com/friendship-app/moods/smiling.png',
        );
      }),
    );

exports.down = knex => knex.schema.dropTableIfExists('moods');
