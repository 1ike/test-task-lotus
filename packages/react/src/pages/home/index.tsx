import { useEffect, useState } from 'react';
import { Link, Form, useLoaderData, ActionFunctionArgs, useActionData } from 'react-router-dom';
import { z } from 'zod';

import { RoomName, regexStringRawName, regexStringRawCountdownStartValue } from '@lotus/shared';
import { TITLE_POSTFIX, TIMER } from '../../config';
import styles from './home.module.scss';
import { fetchRoomNames, deleteRoom, createRoom } from '../../api';

const defaultTextInputValue = '';

export function Home() {
  const addedRooms = useLoaderData() as RoomName[];
  const newRoomName = useActionData();

  const [name, setName] = useState(defaultTextInputValue);
  const [countdownStartValue, setCountdownStartValue] = useState(defaultTextInputValue);

  useEffect(() => {
    if (newRoomName) {
      setName(defaultTextInputValue);
      setCountdownStartValue(defaultTextInputValue);
    }
  }, [newRoomName]);

  useEffect(() => {
    document.title = `Главная${TITLE_POSTFIX}`;
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Комнаты для торгов</h1>
      <section className={styles.rooms}>
        {addedRooms.map((roomName) => (
          <div key={roomName} className={styles.room}>
            <Link to={`/room/${roomName}`}>Войти в комнату {roomName}</Link>
            <Form method="delete">
              <input type="text" hidden name="deletingName" value={roomName} readOnly />
              <button type="submit">Удалить комнату</button>
            </Form>
          </div>
        ))}
      </section>
      <Form method="post" className={styles.form}>
        <h2>Создание комнат</h2>
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label className={styles.inputRaw}>
          Введите имя новой комнаты (допускаются буквы, цифры, - и _)
          <input
            type="text"
            name="name"
            placeholder="имя комнаты"
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
            pattern={regexStringRawName}
            required
          />
        </label>
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label className={styles.inputRaw}>
          Задайте для нее время на ход торгов (в секундах). <br /> Заполнение необязательно (по
          умолчанию {TIMER}).
          <input
            type="text"
            name="countdownStartValue"
            placeholder={TIMER}
            value={countdownStartValue}
            onChange={(e) => setCountdownStartValue(e.currentTarget.value)}
            pattern={regexStringRawCountdownStartValue}
          />
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
        name: z.string().min(1).regex(new RegExp(regexStringRawName)),
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
