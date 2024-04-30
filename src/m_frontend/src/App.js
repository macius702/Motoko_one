import { html, render } from 'lit-html';
import { m_backend } from 'declarations/m_backend';

class App {
  question = '';
  votes = [];

  constructor() {
    this.#fetchData();
  }

  #fetchData = async () => {
    this.question = await m_backend.getQuestion();
    this.votes = await m_backend.getVotes();
    this.#render();
  };

  #handleVote = async (entry) => {
    this.votes = await m_backend.vote(entry);
    this.#render();
  };

  #handleReset = async () => {
    this.votes = await m_backend.resetVotes();
    this.#render();
  };

  #render() {
    let body = html`
      <div class="container">
        <div class="title-container">
          <h1>Simple Voting Poll</h1>
        </div>
        <h2 id="question">${this.question}</h2>

        <div class="form-container">
          <form id="radioForm">
            ${this.votes.map(([entry, votes]) => html`
              <label>
                <input type="radio" name="option" value="${entry}"> ${entry}
              </label><br>
            `)}
            <button type="submit" @click=${(e) => {
              e.preventDefault();
              const selectedOption = document.querySelector('input[name="option"]:checked').value;
              this.#handleVote(selectedOption);
            }}>Vote</button>
          </form>
        </div>

        <h2 id="results-title">Results</h2>
        <div id="results">
          ${this.votes.map(([entry, votes]) => html`
            <p>${entry}: ${votes}</p>
          `)}
        </div>
      </div>
      <button id="reset" @click=${this.#handleReset}>Reset Poll</button>
    `;
    render(body, document.getElementById('root'));
  }
}

export default App;