import { LitElement, html, css } from 'lit-element';
import '@lion/accordion/lion-accordion.js';
import '@lion/dialog/lion-dialog.js';
import './../components/player-champion';
import { 
  darkGrey,
  gold,
  grey,
  offWhite,
} from './../colors';

export class LeagueClashTeams extends LitElement {
  static get properties() {
    return {
      players: { type: Object },
      filteredChamps: { type: Object },
      team: { type: String },
      comps: { type: Object }
    };
  }

  static get styles() {
    return css` 
      h1 {
        margin-top: 0px;
        padding: 0 10px;
        font-family: Segoe UI Italic;
      }

      h4 {
        margin-bottom: 0px;
        padding: 0 10px;
        font-family: Segoe UI;
        font-weight: normal;
      }

      img {
        height: 45px;
        border-radius: 15px;
      }

      #container {
        margin: 15px 3%;
        display: grid;
        grid-template-columns: 46% 34% 14%;
        grid-gap: 3%;
      }

      .comps-col {
        margin-top: 30px;
        height: calc(100vh - 130px);
        overflow-y: scroll;
      }

      .champs-col {
        margin-top: 30px;
        height: calc(100vh - 130px);
      }

      .remove {
        height: 20px;
      }

      .search-champs {
        overflow-y: scroll;
        height: calc(100vh - 230px);
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
        grid-gap: 5px;
        padding: 20px;
      }

      #search {
        width: 90%;
        text-align: center; 
        font-family: Segoe UI;
        font-size: 15pt;
        border-bottom: 1px solid ${gold};
      }

      .styled-select {
        width: 140px;
        background-color: ${darkGrey};
        border-radius: 0;
        color: ${grey};
        font-family: Segoe UI italic;
        padding: 5px;
        height: 34px;
      }

      input {
        border: 0;
        height: 24px;
        width: 210px;
        background-color: ${darkGrey};
        border-radius: 0;
        color: ${offWhite};
        font-family: Segoe UI italic;
        padding: 5px;
      }

      input::placeholder {
        color: ${grey};
        font-family: Segoe UI italic;
      }

      .player-header {
        border-bottom: 1px solid ${gold};
        font-size: 15pt;
        display: grid;
        grid-template-columns: 160px 1fr 1fr;
        height: 30px;
        margin: 10px;
      }

      .player-header img {
        height: 18px;
        width: 18px;
        border-radius: 0px;
      }

      .player-champs { 
        margin: 0 10px;
        display: grid;
        grid-template-columns: 108px 1fr 76px 1fr;
        min-height: 45px;
      }

      .player-champs > div {
        min-height: 45px;
        font-family: Segoe UI Italic;
        color: ${grey};
        line-height: 45px;
      }

      .comps-header {
        padding: 12px;
      }

      .comp-placeholder {
        height: 45px;
        width: 45px;
        border-radius: 15px;
        border: 1px solid ${grey};
      }

      #addComp {
        margin-left: 10px;
      }

      .comp-header {
        border-bottom: 1px solid ${gold};
        font-size: 15pt;
        display: grid;
        grid-gap: 5px;
        grid-template-columns: 1fr 50px 50px 50px 50px 50px 50px;
        padding-right: 10px;
        height: 28px;
      }

      .role {
        height: 18px;
        width: 18px;
        border-radius: 0px;
        margin: auto;
      }

      .comp-champs {
        font-size: 15pt;
        display: grid;
        grid-gap: 5px;
        grid-template-columns: 1fr 50px 50px 50px 50px 50px 50px;
        margin: 10px 0 20px 0;
        padding-right: 10px;
      }

      lion-dialog {
        padding-left: 12px;
      }

      .comps {
        padding: 12px 22px;
      }

      .champions {
        padding: 12px;
      }

      .comp h3 {
        text-align: center;
      }

      .draggable {
        height: 50px;
      }

      .add-members {
        padding: 0 10px 10px 10px;
      }


      .players {
        display: flex;
        justify-content: space-between;
      }

      button {
        height: 34px;
        border-radius: 5px;
        padding: 5px 15px;
      }

      lion-accordion h4 {
        padding: 12px;
      }

      lion-accordion p {
        padding: 12px;
      }

      lion-dialog img {
        height: 50px;
      }
    `
  }

  addMember() {
    const playerName = this.shadowRoot.getElementById('add-member').value;
    const playerRole = this.shadowRoot.getElementById('role').value;
    window.database.ref(`${this.team}/${playerName}`).set({
      playerName: playerName,
      role: playerRole,
      mainChamps : [],
      learningChamps : [],
    });
  }
  
  addChamp(event) {
    const { player, champ, list } = event.detail;
    const playerInfo = this.playersData[player];

    if(list === 'main') {
      if(!(playerInfo.mainChamps && playerInfo.mainChamps.some(champName => champName === champ))) {
        const newChamps = playerInfo.mainChamps ? playerInfo.mainChamps.concat([champ]) : [champ];
        window.database.ref(`${this.team}/${player}`).update({
          mainChamps : newChamps
        });
      }
    } else {
      if(!(playerInfo.learningChamps && playerInfo.learningChamps.some(champName => champName === champ))) {
        const newChamps = playerInfo.learningChamps ? playerInfo.learningChamps.concat([champ]) : [champ];
        window.database.ref(`${this.team}/${player}`).update({
          learningChamps : newChamps
        });
      }
    }
  }

  addComp() {
    const comp = this.shadowRoot.getElementById('addComp').value;
    if(comp) {
      window.database.ref(`${this.team}_comps/${comp}`).set({
        top: [],
        jungle: [],
        mid: [],
        bot: [],
        support: [],
        name: comp
      });
    }
  }

  removeComp(comp) {
    if (window.confirm(`You sure you want to delete ${comp}?`)) {
      window.database.ref(`${this.team}_comps/${comp}`).remove()
    }
  }

  addChampToComp(event) {
    event.preventDefault();
    let champ = event.dataTransfer.getData("text");
    if(champ.indexOf('.')) {
      const splitChamp = champ.split('/');
      champ = splitChamp[splitChamp.length - 1].split('.')[0];
    };
    const data = event.target.id.split('-');
    const compInfo = this.compsData[data[0]];
    if(compInfo && !(compInfo[data[1]] && compInfo[data[1]].some(champName => champName === champ))) {
      const newChamps = compInfo[data[1]] ? compInfo[data[1]].concat([champ]) : [champ];
      const update = {}
      update[data[1]] = newChamps
      window.database.ref(`${this.team}_comps/${data[0]}`).update(update);
    }
  }

  removeChampFromComp(champ, comp, role) {
    const compInfo = this.compsData[comp];
    if(compInfo[role] && compInfo[role].some(champName => champName === champ)) {
      const newChamps = compInfo[role].filter(champName => champ !== champName);
      const update = {}
      update[role] = newChamps
      window.database.ref(`${this.team}_comps/${comp}`).update(update);
    }
  }

  addChampToPlayer(event) {
    event.preventDefault();
    let champ = event.dataTransfer.getData("text");
    if(champ.indexOf('.')) {
      const splitChamp = champ.split('/');
      champ = splitChamp[splitChamp.length - 1].split('.')[0];
    };
    const data = event.target.id || event.path[1].id;
    const dataSplit = data.split('-');
    const playerInfo = this.playersData[dataSplit[0]];
    if(dataSplit[1] === 'prim') {
      if(!(playerInfo.mainChamps && playerInfo.mainChamps.some(champName => champName === champ))) {
        const newChamps = playerInfo.mainChamps ? playerInfo.mainChamps.concat([champ]) : [champ];
        window.database.ref(`${this.team}/${dataSplit[0]}`).update({
          mainChamps : newChamps
        });
      }
    } else {
      if(!(playerInfo.learningChamps && playerInfo.learningChamps.some(champName => champName === champ))) {
        const newChamps = playerInfo.learningChamps ? playerInfo.learningChamps.concat([champ]) : [champ];
        window.database.ref(`${this.team}/${dataSplit[0]}`).update({
          learningChamps : newChamps
        });
      }
    }
  }

  removeChampFromPlayer(player, champ, list) {
    const playerInfo = this.playersData[player];
    if(list === 'main') {
      if(playerInfo.mainChamps && playerInfo.mainChamps.some(champName => champName === champ)) {
        const newChamps = playerInfo.mainChamps.filter(champName => champ !== champName);
        window.database.ref(`${this.team}/${player}`).update({
          mainChamps : newChamps
        });
      }
    } else {
      if(playerInfo.learningChamps && playerInfo.learningChamps.some(champName => champName === champ)) {
        const newChamps = playerInfo.learningChamps.filter(champName => champ !== champName);
        window.database.ref(`${this.team}/${player}`).update({
          learningChamps : newChamps
        });
      }
    }
  }

  onDragStart(event) {
    event.dataTransfer.setData("text", event.target.id);
  }

  allowDrop(event) {
    event.preventDefault();
  }

  filterChamps() {
    const searchValue = this.shadowRoot.getElementById('search').value;
    console.log('filter', searchValue)
    this.filteredChamps = this.champs.filter(champName => champName.toLowerCase().includes(searchValue.toLowerCase()));
  }

  async connectedCallback() {
    super.connectedCallback();

    this.team = window.location.pathname.split('/')[2];
    const teamRef = window.database.ref(`${this.team}`);
    teamRef.on('value', (snapshot) =>{
      this.playersData = snapshot.val();
      this.players = this.playersData ? Object.keys(this.playersData) : [];
    });

    const teamCompRef = window.database.ref(`${this.team}_comps`);
    teamCompRef.on('value', (snapshot) =>{
      this.compsData = snapshot.val();
      this.comps = this.compsData ? Object.keys(this.compsData) : [];
    });

    const championData = await axios.get('https://ddragon.leagueoflegends.com/cdn/11.4.1/data/en_US/champion.json');
    this.originalChamps = championData.data.data;
    this.champs = Object.keys(this.originalChamps);
    this.filteredChamps = this.champs;
  }

  render() {
    return html`
      <div id="container">
        <div class="players-col">
          <h4>Team</h4>
          <h1>${this.team}</h1>
          <div class="add-members">
            <input id="add-member" placeholder="Add Player">
            <select id="role" class="styled-select">
              <option value="Top">Top</option>
              <option value="Jungle">Jungle</option>
              <option value="Mid">Mid</option>
              <option value="Bot">Bot</option>
              <option value="Support">Support</option>
            </select>
            <button @click=${this.addMember}>Add</button>
          </div>
          ${this.players && this.players.map(player => html`
            <div class="player-header">
              <div>${this.playersData[player].playerName}</div>
              <img class="role" src="./../assets/positions/${this.playersData[player].role}_Icon.png"/>
              <div class="role"></div>
            </div>
            <div class="player-champs">
              <div>Primary Role:</div>
              <div id="${player}-prim" @drop=${this.addChampToPlayer} @dragover=${this.allowDrop}>
              ${this.playersData[player].mainChamps && this.playersData[player].mainChamps.map(champ => html`
                <img src="./../assets/champion/${champ.replace(/\s/g, '')}.png" @click=${() => this.removeChampFromPlayer(player, champ, 'main')}>
              `)}
              </div>
              <div>Learning:</div>
              <div id="${player}-learn" @drop=${this.addChampToPlayer} @dragover=${this.allowDrop}>
              ${this.playersData[player].learningChamps && this.playersData[player].learningChamps.map(champ => html`
                <img src="./../assets/champion/${champ.replace(/\s/g, '')}.png" @click=${() => this.removeChampFromPlayer(player, champ, 'learning')}>
              `)}
              </div>
            </div>

          `)}
        </div>
        <div class="comps-col">
          <div class="comps-header">
            <h1>Team Compositions</h1>
            <input id="addComp" placeholder="Add Comp" required/>
            <button @click=${this.addComp}>Add Comp</button>
          </div>
          <div class="comps">
            ${this.comps && this.comps.map(comp => html`
              <div class="comp-header" id=${comp}>
                <span>${this.compsData[comp].name}</span>
                <svg class="role" @click=${() => this.removeComp(comp)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <img class="role" src="./../assets/positions/Top_Icon.png"/>
                <img class="role" src="./../assets/positions/Jungle_Icon.png"/>
                <img class="role" src="./../assets/positions/Mid_Icon.png"/>
                <img class="role" src="./../assets/positions/Bot_Icon.png"/>
                <img class="role" src="./../assets/positions/Support_Icon.png"/>
              </div>
              <div class="comp-champs">
                <span></span>
                <span></span>
                <div id="${comp}-top" class=${!this.compsData[comp].top ? "comp-placeholder" : ""} @drop=${this.addChampToComp} @dragover=${this.allowDrop}>
                  ${this.compsData[comp].top && this.compsData[comp].top.map(champ => html`
                    <img src="./../assets/champion/${champ.replace(/\s/g, '')}.png" @click=${() => this.removeChampFromComp(champ, comp, 'top')}>
                  `)}
                </div>
                <div id="${comp}-jungle" class=${!this.compsData[comp].jungle ? "comp-placeholder" : ""} @drop=${this.addChampToComp} @dragover=${this.allowDrop}>
                  ${this.compsData[comp].jungle && this.compsData[comp].jungle.map(champ => html`
                    <img src="./../assets/champion/${champ.replace(/\s/g, '')}.png" @click=${() => this.removeChampFromComp(champ, comp, 'jungle')}>
                  `)}
                </div>
                <div id="${comp}-mid" class=${!this.compsData[comp].mid ? "comp-placeholder" : ""} @drop=${this.addChampToComp} @dragover=${this.allowDrop}>
                  ${this.compsData[comp].mid && this.compsData[comp].mid.map(champ => html`
                    <img src="./../assets/champion/${champ.replace(/\s/g, '')}.png" @click=${() => this.removeChampFromComp(champ, comp, 'mid')}>
                  `)}
                </div>
                <div id="${comp}-bot" class=${!this.compsData[comp].bot ? "comp-placeholder" : ""} @drop=${this.addChampToComp} @dragover=${this.allowDrop}>
                  ${this.compsData[comp].bot && this.compsData[comp].bot.map(champ => html`
                    <img src="./../assets/champion/${champ.replace(/\s/g, '')}.png" @click=${() => this.removeChampFromComp(champ, comp, 'bot')}>
                  `)}
                </div>
                <div id="${comp}-support" class=${!this.compsData[comp].support ? "comp-placeholder" : ""} @drop=${this.addChampToComp} @dragover=${this.allowDrop}>
                  ${this.compsData[comp].support && this.compsData[comp].support.map(champ => html`
                    <img src="./../assets/champion/${champ.replace(/\s/g, '')}.png" @click=${() => this.removeChampFromComp(champ, comp, 'support')}>
                  `)}
                </div>
              </div>
            `)}
          </div>
        </div>
        <div class="champs-col">
          <input id="search" placeholder="Search" @keyup=${this.filterChamps}/>
          <div class="search-champs">
          ${this.filteredChamps && this.filteredChamps.map(champName => html`
            <img draggable="true" class="draggable" src="./../assets/champion/${champName.replace(/\s/g, '')}.png" id=${champName} @dragstart=${this.onDragStart}>
          `)}
          </div>
          <div style="margin: 10px auto; width:150px;">Click & drag to add</div>
        </div>
      </div>
    `;
  }
}

customElements.define('league-clash-teams', LeagueClashTeams);
