import { useContext, useEffect, useState } from 'react';
import { Link, Form, useLoaderData, ActionFunctionArgs, useActionData } from 'react-router-dom';
import { z } from 'zod';

import { RoomName, regexStringRawName, regexStringRawCountdownStartValue } from '@lotus/shared';
import { TITLE_POSTFIX, TIMER, DEFAULT_ROOM_NAME } from '../../config';
import styles from './home.module.scss';
import { fetchRoomNames, deleteRoom, createRoom } from '../../api';
import { ErrorMessageContext } from '../../contexts/error';

/* eslint-disable @typescript-eslint/indent */
type LoaderResponse =
  | {
      success: true;
      data: RoomName[];
    }
  | {
      success: false;
      error: Error;
    };
/* eslint-enable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/indent */
type ActionResponse =
  | {
      success: true;
      data: RoomName;
    }
  | {
      success: false;
      error: Error;
    };
/* eslint-enable @typescript-eslint/indent */

const defaultTextInputValue = '';

export function Home() {
  const loaderResponse = useLoaderData() as LoaderResponse;
  const actionResponse = useActionData() as ActionResponse | undefined;

  const [addedRooms, setAddedRooms] = useState<RoomName[]>([]);
  const [name, setName] = useState(defaultTextInputValue);
  const [countdownStartValue, setCountdownStartValue] = useState(defaultTextInputValue);

  const { setErrorMessage, resetErrorMessage } = useContext(ErrorMessageContext);

  useEffect(() => {
    if (actionResponse) {
      if (actionResponse.success) {
        setName(defaultTextInputValue);
        setCountdownStartValue(defaultTextInputValue);
      } else {
        setErrorMessage?.(actionResponse.error.message);
      }
    }
    if (loaderResponse.success) {
      setAddedRooms(loaderResponse.data);
    } else {
      setErrorMessage?.(`Ошибка загрузки списка комнат ${loaderResponse.error.message}`);
    }

    // eslint-disable-next-line consistent-return
    return () => {
      resetErrorMessage?.();
    };
  }, [actionResponse, loaderResponse, setErrorMessage, resetErrorMessage]);

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
              {roomName === DEFAULT_ROOM_NAME ? (
                '(Комната по умолчанию)'
              ) : (
                <button type="submit">Удалить комнату</button>
              )}
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
  try {
    const data = await fetchRoomNames();
    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error : new Error('неизвестная ошибка'),
    };
  }
};

export const action = async ({ request }: ActionFunctionArgs): Promise<ActionResponse> => {
  switch (request.method) {
    case 'POST': {
      const formData = await request.formData();

      const Schema = z.object({
        name: z
          .string()
          .min(1, 'имя не должно быть пустым')
          .regex(new RegExp(regexStringRawName), 'имя не должно содержать недопустимых символов'),
        countdownStartValue: z.coerce
          .number({
            invalid_type_error: 'время на ход торгов должно быть числом',
          })
          .optional(),
      });

      const countdownStartValue = formData.get('countdownStartValue');
      const validationResult = Schema.safeParse({
        name: formData.get('name'),
        ...(countdownStartValue && { countdownStartValue }),
      });

      if (!validationResult.success) {
        const errorMessage = validationResult.error.issues.map((e) => e.message).join(', ');
        return {
          success: false,
          error: new Error(`Ошибки валидации: ${errorMessage}.`),
        };
      }

      try {
        const data = await createRoom(validationResult.data);
        return {
          success: true,
          data,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error : new Error('неизвестная ошибка'),
        };
      }
    }
    case 'DELETE': {
      const formData = await request.formData();
      const name = formData.get('deletingName') as RoomName;

      try {
        const data = await deleteRoom(name);
        return {
          success: true,
          data,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error : new Error('неизвестная ошибка'),
        };
      }
    }
    default: {
      // eslint-disable-next-line @typescript-eslint/no-throw-literal
      return {
        success: false,
        error: new Error('неизвестная ошибка'),
      };
    }
  }
};
