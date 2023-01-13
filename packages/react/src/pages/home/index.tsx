import { useEffect } from 'react';
import { Link, Form, useLoaderData, ActionFunctionArgs } from 'react-router-dom';
import { z } from 'zod';

import { CreateRoomRequest, RoomName } from '@lotus/shared';
import { DEFAULT_ROOM_NAME, TITLE_POSTFIX } from '../../config';
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
          <Link key={roomName} to={`/room/${roomName}`}>
            Войти в комнату {roomName}
          </Link>
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
          Задайте для нее время на ход торгов (в секундах). Заполнение необязательно (по умолчанию
          120).
          <input type="text" name="countdownStartValue" placeholder="120" />
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
      console.log('validationResult = ', validationResult);

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
