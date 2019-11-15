import React, {useEffect, useState} from "react";
import uuid from "uuid";
import deepcopy from "deepcopy";
import Nav from "../Nav";
import Header from "../Header";
import Container from "../Container";
import Card from "../Card";
import Footer from "../Footer";
import data from "../../data.json";

const FIELD_WIDTH = 6;
const FIELD_HEIGHT = 3;

function shuffleArray(array) {
	return array.sort(() => .5 - Math.random());
}

function generateCards(count) {
  if (count % 2 !== 0)
    throw Error("Count must be even: 2, 4, 6, etc. but it is " + count);

  const cards = shuffleArray(data)
    .slice(0, count / 2)
    .map(item => ({
      id: uuid.v4(),
      imageURL: item.image,
      isFlipped: false,
      canFlip: true
    }))
    .flatMap(e => [e, {...deepcopy(e), id: uuid.v4()}]);

  return shuffleArray(cards);
}

export default function Game() {
	const totalCards = FIELD_WIDTH * FIELD_HEIGHT;

	const [cards, setCards] = useState(generateCards(totalCards));
	const [canFlip, setCanFlip] = useState(false);
	const [firstCard, setFirstCard] = useState(null);
  const [secondCard, setSecondCard] = useState(null);
  const [score, setScore] = useState(0);

	function setCardIsFlipped(cardID, isFlipped) {
		setCards(prev => prev.map(c => {
			if (c.id !== cardID)
				return c;
			return {...c, isFlipped};
		}));
  }
  
	function setCardCanFlip(cardID, canFlip) {
		setCards(prev => prev.map(c => {
			if (c.id !== cardID)
				return c;
			return {...c, canFlip};
		}));
	}

	useEffect(() => {
		setTimeout(() => {
			let index = 0;
			for (const card of cards) {
				setTimeout(() => setCardIsFlipped(card.id, true), index++ * 100);
			}
			setTimeout(() => setCanFlip(true), cards.length * 100);
		}, 3000);
	}, []);


	function resetFirstAndSecondCards() {
		setFirstCard(null);
		setSecondCard(null);
	}

	function onSuccessGuess() {
		setCardCanFlip(firstCard.id, false);
		setCardCanFlip(secondCard.id, false);
		setCardIsFlipped(firstCard.id, false);
		setCardIsFlipped(secondCard.id, false);
    resetFirstAndSecondCards();
    setScore(score + 10);
  }
  
	function onFailureGuess() {
		const firstCardID = firstCard.id;
		const secondCardID = secondCard.id;

		setTimeout(() => {
			setCardIsFlipped(firstCardID, true);
		}, 1000);
		setTimeout(() => {
			setCardIsFlipped(secondCardID, true);
		}, 1200);

    resetFirstAndSecondCards();
    setScore(score - 1);
	}

	useEffect(() => {
		if (!firstCard || !secondCard)
			return;
		(firstCard.imageURL === secondCard.imageURL) ? onSuccessGuess() : onFailureGuess();
	}, [firstCard, secondCard]);


	function onCardClick(card) {
		if (!canFlip)
			return;
		if (!card.canFlip)
			return;

		// eslint-disable-next-line no-mixed-operators
		if ((firstCard && (card.id === firstCard.id) || (secondCard && (card.id === secondCard.id))))
			return;

		setCardIsFlipped(card.id, false);

		(firstCard) ? setSecondCard(card) : setFirstCard(card);
	}

  return (
    <div>
      <Nav score={score} />
      <Header />
      <Container>
        <div className="game container-md">
          <div className="cards-container">
            {
              cards.map(card => (
                <Card onClick={() => onCardClick(card)} key={card.id} {...card} />
              ))
            }
          </div>
        </div>
      </Container>
      <Footer />
    </div>
  );
}
