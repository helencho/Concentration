import React, { Component } from 'react'
import styles from './App.css'
import 'font-awesome/css/font-awesome.min.css'

const Board = ({ board, handleClick }) => {
  return (
    <div className='board'>{board.map((url, i) => (
      <div className='card' id={i} onClick={handleClick}>
        <img className='img' src={url} name={i} onClick={handleClick} alt='card' />
      </div>)
    )}</div>
  )
}

class App extends Component {
  constructor() {
    super()

    this.cards = {
      back: './images/back-blank.png',
      bicycle: './images/bicycle.png',
      diamond: './images/diamond.png',
      flask: './images/flask.png',
      key: './images/key.png',
      magic: './images/magic.png',
      paperclip: './images/paperclip.png',
      snowflake: './images/snowflake.png',
      ticket: './images/ticket.png'
    }

    this.state = {
      answer: [
        this.cards.bicycle, this.cards.diamond, this.cards.flask, this.cards.key,
        this.cards.magic, this.cards.paperclip, this.cards.snowflake, this.cards.ticket,
        this.cards.bicycle, this.cards.diamond, this.cards.flask, this.cards.key,
        this.cards.magic, this.cards.paperclip, this.cards.snowflake, this.cards.ticket
      ],
      board: [],
      guesses: [],
      counter: 0,
      messageBox: false
    }
  }

  componentDidMount = () => {
    this.populateBoards()
  }


  // FUNCTION --- shuffles the existing array 
  shuffle = array => {
    let i = 0
    let j = 0
    let temp = null
    for (i = array.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1))
      temp = array[i]
      array[i] = array[j]
      array[j] = temp
    }
    return array
  }


  // FUNCTION --- populates the initial board and answer board 
  populateBoards = () => {
    let newBoard = [] // empty for now 
    let newAnswer = this.shuffle(this.state.answer) // shuffles the answer board 
    for (let i = 0; i < 16; i++) {
      newBoard.push(this.cards.back) // creates an array all containing back card image urls 
    }
    // set state and mount to begin the game 
    this.setState({
      answer: newAnswer,
      board: newBoard
    })
  }


  // FUNCTION --- checks the two cards to see if they're equal 
  checkCards = () => {
    const { answer, board, guesses, counter } = this.state

    // if the two cards are equal 
    if (guesses[0].url === guesses[1].url) {
      // keep cards where they are, reset guesses, add 1 to counter 
      let newCount = this.state.counter += 1
      this.setState({
        guesses: [],
        counter: newCount
      })

      // if the two cards are not equal 
    } else {
      // copy existing board as an array 
      let newBoard = [...board]
      // reset both cards to the 'back' image 
      for (let i = 0; i < 2; i++) {
        let index = guesses[i].index
        newBoard[index] = this.cards.back
      }
      // update state with the new cards and reset guesses 
      this.setState({
        board: newBoard,
        guesses: []
      })
    }
    // clear its own timeout (???)
    window.clearTimeout(this.checkCards)
  }


  // FUNCTION --- when user clicks image, show the underlying card 
  onClickImage = event => {
    const { answer, board, guesses, counter } = this.state

    let index;

    // grab the index number 
    if (event.target.className === 'card') {
      index = event.target.id
    } else if (event.target.className === 'img') {
      index = event.target.name
    }

    // only if there have been less than 2 guesses, go ahead with updating state 
    if (index && guesses.length < 2) {

      // copy existing board 
      let newBoard = [...board]
      newBoard[index] = answer[index]

      // make a newGuess object containing the clicked image's index number and url 
      let newGuess = {
        index: index,
        url: answer[index]
      }

      // add the new board and guess object to the state 
      this.setState({
        board: newBoard,
        guesses: [...guesses, newGuess]
      })
    }
  }

  onClickButton = () => {
    // call populateBoards function to restart the game! 
    // pass in an argument 
    if (this.state.guesses.length === 1) {
      this.populateBoards()
      // and close the message box 
      let newState = [...this.state]
      console.log(newState)
    }
    console.log('clicking button')
  }

  // HERE!! working on how to make the message box appear and disappear 
  // might get rid of this.state.messageBox because I don't utilize it well 
  // something is wrong with overstacking 
  onClickExit = () => {
    // close the message box 
    console.log('clicking exit')
  }

  gameComplete = () => {
    if (this.state.counter === 8 && !this.state.messageBox) {
      this.setState({
        messageBox: true
      })
    }
  }

  render() {
    const { answer, board, guesses, counter, messageBox } = this.state
    console.log(this.state)

    if (guesses.length === 2) {
      // wait 1 second before checking the card
      window.setTimeout(this.checkCards, 800)
    }

    const message = (
      <div className="message">
        <div className="top">
          <p>Excellent</p>
        </div>

        <div className="middle">
          <p>Time 00:55:00</p>
          <p>Best 00:30:00</p>
        </div>

        <div className="bottom">
          <div className="bottom-left"><p onClick={this.onClickExit}><i className="fa fa-times-circle-o fa-2x" aria-hidden="true"></i>
          </p></div>
          <div className="bottom-right"><button onClick={this.onClickButton}>Play again!</button></div>
        </div>

      </div>
    )

    return (
      <div className='main'>
        <Board board={board} handleClick={this.onClickImage} />
        {this.gameComplete()}
        {messageBox ? message : ''}
      </div>
    );
  }
}

export default App;
