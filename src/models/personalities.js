import knex from '../utils/knex';

export const dbGetPersonalities = () => knex.select().from('personalities');

export const dbRegisterPersonalities = userPersonalities =>
  knex.insert(userPersonalities).into('user_personality');

export const dbGetUserPersonalities = userId =>
  knex
    .select('id', 'name')
    .from('user_personality')
    .leftJoin('personalities', 'id', 'personalityId')
    .where({ userId });

export const dbUpdateUserPersonalities = (personalities, userId) =>
  knex.transaction(async trx => {
    await trx
      .del()
      .from('user_personality')
      .where({ userId });

    const updatedPersonalities = [];
    personalities.map(personality =>
      updatedPersonalities.push({
        userId,
        personalityId: personality,
        level: 5,
      }),
    );
    return trx
      .insert(updatedPersonalities)
      .into('user_personality')
      .returning('*');
  });
