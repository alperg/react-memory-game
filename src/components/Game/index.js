import React, { Component } from "react";
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

class Game extends Component {
  state = {
    cards: generateCards(FIELD_WIDTH * FIELD_HEIGHT),
    canFlip: true,
    firstCard: null,
    secondCard: null,
    score: 0,
    topScore: 0
  };

  componentDidMount() {
    this.setState({ cards: generateCards(FIELD_WIDTH * FIELD_HEIGHT) });
    console.log(this.state.cards);
  }

  componentDidUpdate(prevProps, prevState) {
    // console.log('changed:');
    // console.log(JSON.stringify(prevState.cards) === JSON.stringify(this.state.cards));

    if(JSON.stringify(prevState.cards) !== JSON.stringify(this.state.cards)) {
      const { cards } = this.state;

      setTimeout(() => {
        let index = 0;
        for (const card of cards) {
          setTimeout(() => this.setCardIsFlipped(card.id, true), index++ * 100);
        }
        setTimeout(() => this.setCardCanFlip(true), cards.length * 100);
      }, 3000);
    }

    if(!this.state.firstCard || !this.state.secondCard) {
      return;
    }

    if(this.state.firstCard.imageURL === this.state.secondCard.imageURL) {
      this.onSuccessGuess();
    } else {
      this.onFailureGuess();
    }
  }

  setCardIsFlipped = (cardID, isFlipped) => {
    const cards = this.state.cards.map(c => {
			if (c.id !== cardID) {
        return c;
      }
			return {...c, isFlipped};
    });
    console.log(cards);
		this.setState({ cards });
	}
  
  setCardCanFlip = (cardID, canFlip) => {
    console.log(canFlip)
    const cards = this.state.cards.map(c => {
			if (c.id !== cardID) {
        return c;
      }
			return {...c, canFlip};
    });
    console.log(cards);
    this.setState({ cards });
	}

  resetFirstAndSecondCards = () => {
    this.setState({
      firstCard: null,
      secondCard: null
    });
	}

	onSuccessGuess = () => {
    const { firstCard, secondCard } = this.state;

		this.setCardCanFlip(firstCard.id, false);
		this.setCardCanFlip(secondCard.id, false);
		this.setCardIsFlipped(firstCard.id, false);
		this.setCardIsFlipped(secondCard.id, false);
		this.resetFirstAndSecondCards();
	}
  
  onFailureGuess = () => {
    const { firstCard, secondCard } = this.state;
		const firstCardID = firstCard.id;
		const secondCardID = secondCard.id;

		setTimeout(() => {
			this.setCardIsFlipped(firstCardID, true);
    }, 1000);
    
		setTimeout(() => {
			this.setCardIsFlipped(secondCardID, true);
		}, 1200);

		this.resetFirstAndSecondCards();
	}

	onCardClick = (card) => {
    console.log(card);
    const { canFlip, firstCard, secondCard } = this.state;

		if (!canFlip) {
      return;
    }

		if (!card.canFlip) {
      return;
    }

		// eslint-disable-next-line no-mixed-operators
		if ((firstCard && (card.id === firstCard.id) || (secondCard && (card.id === secondCard.id)))) {
      return;
    }

    this.setCardIsFlipped(card.id, false);

		if(firstCard) {
      this.setState({
        secondCard: card
      });
    } else {
      this.setState({
        firstCard: card
      });
    }
	}

  render() {
    const { cards, score, topScore } = this.state;

    return (
      <div>
        <Nav score={score} topScore={topScore} />
        <Header />
        <Container>
          <div className="game container-md">
            <div className="cards-container">
              {
                cards.map(card => (
                  <Card onClick={() => this.onCardClick(card)} key={card.id} {...card}/>
                ))
              }
            </div>
          </div>
        </Container>
        <Footer />
      </div>
    );
  }
}

export default Game;
