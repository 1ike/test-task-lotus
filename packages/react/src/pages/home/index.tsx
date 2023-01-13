import { useEffect } from 'react';
import { Link, Form, useLoaderData, ActionFunctionArgs } from 'react-router-dom';
import { z } from 'zod';

import { RoomName } from '@lotus/shared';
import { TITLE_POSTFIX, TIMER } from '../../config';
import styles from './home.module.scss';
import { fetchRoomNames, deleteRoom, createRoom } from '../../api';

export function Home() {
  const addedRooms = useLoaderData() as RoomName[];

  useEffect(() => {
    document.title = `Главная${TITLE_POSTFIX}`;
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Комнаты для торгов</h1>
      <section className={styles.rooms}>
        {addedRooms.map((roomName) => (
          <div className={styles.room}>
            <Link key={roomName} to={`/room/${roomName}`}>
              Войти в комнату {roomName}
            </Link>
            <Form method="delete">
              <input type="text" hidden name="deletingName" value={roomName} />
              <button type="submit">Удалить комнату</button>
            </Form>
          </div>
        ))}
      </section>
      <Form method="post" className={styles.form}>
        <h2>Создание комнат</h2>
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label className={styles.inputRaw}>
          Введите имя новой комнаты
          <input type="text" name="name" placeholder="имя комнаты" />
        </label>
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label className={styles.inputRaw}>
          Задайте для нее время на ход торгов (в секундах). Заполнение необязательно (по умолчанию{' '}
          {TIMER}).
          <input type="text" name="countdownStartValue" placeholder={TIMER} />
        </label>
        <button type="submit">Создать комнату</button>
      </Form>
    </div>
  );
}

export default Home;

export const loader = async () => {
  return fetchRoomNames();
};

export const action = async ({ request }: ActionFunctionArgs) => {
  switch (request.method) {
    case 'POST': {
      const formData = await request.formData();

      const Schema = z.object({
        name: z.string().min(1),
        countdownStartValue: z.coerce.number().optional(),
      });

      const countdownStartValue = formData.get('countdownStartValue');
      const validationResult = Schema.safeParse({
        name: formData.get('name'),
        ...(countdownStartValue && { countdownStartValue }),
      });

      if (!validationResult.success) return null;

      return createRoom(validationResult.data);
    }
    case 'DELETE': {
      const formData = await request.formData();
      const name = formData.get('deletingName') as RoomName;
      return deleteRoom(name);
    }
    default: {
      // eslint-disable-next-line @typescript-eslint/no-throw-literal
      throw new Response('', { status: 405 });
    }
  }
};
