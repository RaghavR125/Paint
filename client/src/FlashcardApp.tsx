import React, { Component} from "react";
import { isRecord } from './record';



type Page = {kind: "home"} | {kind: "take", name:string} | {kind: "create"} | {kind: "score"};

type FlashcardAppState = {
  page: Page;
  deck: card[];
  error: string
  name: string
  correct:number;
  incorrect:number;
}

/** Displays the UI of the Flashcard application. */
export class FlashcardApp extends Component<{}, FlashcardAppState> {

  constructor(props: {}) {
    super(props);

    this.state = {page: {kind: "home"}, deck:[], error: "", name: "", correct:0, incorrect:0};
  }
  
  render = (): JSX.Element => {
    if (this.state.page.kind === "home"){
      return <HomePage onNewClick={this.doNewClick}
                       onDeckClick={this.doDeckClick}/>;
    }
    else if (this.state.page.kind === "create"){
      return <CreateQuiz  onBackClick={this.doBackClick}/>;
    }
    else if (this.state.page.kind === "take"){
      return <TakeQuiz cards={this.state.deck} name = {this.state.name} onFinishedQuizClick={this.doFinishedQuizClick}/>;
    }
    else{
      return <SaveScore name= {this.state.name} correct={this.state.correct} incorrect={this.state.incorrect} onFinishClick={this.doFinishClick}/>;
    }
  };


  //Changes state back to home page
  doBackClick = (): void => {
    this.setState({page: {kind: "home"}});
  };

  //Changes state to create page to allow user to create new decks
  doNewClick = (): void => {
    this.setState({page: {kind: "create"}});
  };

  //Loads an existing deck
  doDeckClick = (name: string): void => {
    this.doLoadClick(name);
  };

  //When a user finishes taking a quiz, changes state to score page
  doFinishedQuizClick = (correct:number, incorrect:number): void => {
    this.setState({page: {kind: "score"}, correct:correct, incorrect:incorrect});
  }

  //When user types in their name and hits finish after finishing a quiz, changes state back to home page
  doFinishClick = (): void => {
    this.setState({page: {kind: "home"}});
  }
  //Requests list from server and updates name to the name of the file selected
  doLoadClick = (inputName:string): void => {
    this.setState({name: inputName});
    fetch("/api/load?name=" + inputName).then(this.doLoadResp)
        .catch(() => this.doAddError("failed to connect to server"));
  };

  //Checks to make sure no errors in response
  doLoadResp = (resp: Response): void => {
    if (resp.status === 200) {
      resp.json().then(this.doLoadJson)
          .catch(() => this.doAddError("200 response is not JSON"));
    } else if (resp.status === 400) {
      resp.text().then(this.doAddError)
          .catch(() => this.doAddError("400 response is not text"));
    } else {
      this.doAddError(`bad status code from /api/list: ${resp.status}`);
    }
  };

    //Ensures result is in json and updates state to update page to the allow the user to take the selected quiz
    doLoadJson = (val: unknown): void => {
      if (!isRecord(val)) {
        throw new Error("result wasn't a record");
      }
      else{
          if (Array.isArray(val.value)){
            this.setState({page: {kind: "take", name: this.state.name}, deck: val.value});
          }
        }
      }
  
    //Way to store and display errors
  doAddError = (msg: string): void => {
    this.setState({error: msg});
  };


}

