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
      <main>
        <h1>${this.question}</h1>
        <ul>
          ${this.votes.map(([entry, votes]) => html`
            <li>
              ${entry}: ${votes}
              <button @click=${() => this.#handleVote(entry)}>Vote</button>
            </li>
          `)}
        </ul>
        <button @click=${this.#handleReset}>Reset Votes</button>
      </main>
    `;
    render(body, document.getElementById('root'));
  }
}

export default App;