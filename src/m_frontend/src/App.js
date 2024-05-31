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

    // Log m_backend after it's used
    // this.#logToHTML(typeof m_backend); // Display the type of m_backend
    // this.#logToHTML(JSON.stringify(Object.keys(m_backend))); // Display the fields of m_backend
    this.#logToHTML(JSON.stringify(m_backend[Symbol.for('ic-agent-metadata')])); // Display the Symbol property of m_backend
    
    const metadata = m_backend[Symbol.for('ic-agent-metadata')];
    const host = metadata.config.agent._host;

    for (let prop in host) {
      this.#logToHTML(`${prop}: ${JSON.stringify(host[prop])}`);
    }  
  
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

    console.log(m_backend[Symbol.for('ic-agent-metadata')]);

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
            <div>
              <button id="reset" @click=${this.#handleReset}>Reset Poll</button>
            </div>
          </div>
        </div>
        <div id="log"></div> 

    `;
    render(body, document.getElementById('root'));
  }

  #logToHTML = (message) => {
    const logElement = document.getElementById('log');
    const messageElement = document.createElement('pre'); // Use 'pre' for preserving formatting
    // Check if message is a JSON string
    try {
      const json = JSON.parse(message);
      messageElement.innerText = JSON.stringify(json, null, 2); // Pretty print JSON string
    } catch (e) {
      messageElement.innerText = message; // If not a JSON string, print as is
    }
    logElement.appendChild(messageElement);
  }; 
}

export default App;