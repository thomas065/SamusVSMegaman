import { useEffect, useState } from 'react';
import { wait, attack, playerStats, opponentStats, magic } from 'shared';

export const useBattleSequence = sequence => {
  // 0 -> Player's turn
  // 1 -> Opponent's turn
  const [turn, setTurn] = useState(0);
  const [announcerMessage, setAnnouncerMessage] = useState('');

  const [inSequence, setInSequence] = useState(false);

  const [playerHealth, setPlayerHealth] = useState(playerStats.maxHealth);
  const [opponentHealth, setOpponentHealth] = useState(
    opponentStats.maxHealth,
  );

  const [playerAnimation, setPlayerAnimation] = useState('static');
  const [opponentAnimation, setOpponentAnimation] = useState('static');

  useEffect(() => {
    const { mode, turn } = sequence;

    if (mode) {
      const attacker = turn === 0 ? playerStats : opponentStats;
      const receiver = turn === 0 ? opponentStats : playerStats;

      switch (mode) {
        case 'attack': {
          const damage = attack({ attacker, receiver });

          (async () => {
            setInSequence(true);

            setAnnouncerMessage(`${attacker.name} has chosen to attack!`);

            await wait(1000);

            turn === 0
              ? setPlayerAnimation('attack')
              : setOpponentAnimation('attack');

            await wait(100);

            turn === 0
              ? setPlayerAnimation('static')
              : setOpponentAnimation('static');

            await wait(500);

            turn === 0
              ? setOpponentAnimation('damage')
              : setPlayerAnimation('damage');

            await wait(750);

            turn === 0
              ? setOpponentAnimation('static')
              : setPlayerAnimation('static');

            setAnnouncerMessage(`${receiver.name} felt that!`);

            // We don't want a negative HP.
            turn === 0
              ? setOpponentHealth(h => (h - damage > 0 ? h - damage : 0))
              : setPlayerHealth(h => (h - damage > 0 ? h - damage : 0));

            await wait(2000);

            setAnnouncerMessage(`What will ${receiver.name} do?`);

            setTurn(turn === 0 ? 1 : 0);
            setInSequence(false);
          })();

          break;
        }

        case 'magic': {
          const damage = magic({ attacker, receiver });

          (async () => {
            setInSequence(true);

            setAnnouncerMessage(`${attacker.name} has cast a spell!`);

            await wait(1000);

            turn === 0
              ? setPlayerAnimation('magic')
              : setOpponentAnimation('magic');

            await wait(1000);

            turn === 0
              ? setPlayerAnimation('static')
              : setOpponentAnimation('static');

            await wait(500);

            turn === 0
              ? setOpponentAnimation('damage')
              : setPlayerAnimation('damage');

            await wait(750);

            turn === 0
              ? setOpponentAnimation('static')
              : setPlayerAnimation('static');

            setAnnouncerMessage(
              `${receiver.name} doesn't know what hit them!`,
            );

            // We don't want a negative HP.
            turn === 0
              ? setOpponentHealth(h => (h - damage > 0 ? h - damage : 0))
              : setPlayerHealth(h => (h - damage > 0 ? h - damage : 0));

            await wait(2500);

            setAnnouncerMessage(`Now it's ${receiver.name}'s turn!`);

            setTurn(turn === 0 ? 1 : 0);
            setInSequence(false);
          })();

          break;
        }

        default: {
          break;
        }
      }
    }
  }, [sequence]);

  return {
    turn,
    inSequence,
    playerHealth,
    opponentHealth,
    playerAnimation,
    opponentAnimation,
    announcerMessage,
  };
};