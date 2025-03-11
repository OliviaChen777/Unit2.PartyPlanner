const COHORT = "parties—evets";  
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events`;

const state = {
  parties: [],
};



async function getParties() {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
  
      state.parties = data.data;
      renderParties();
    } catch (error) {
      console.error("Error fetching parties:", error);
    }
  }
  
  function renderParties() {
    const partyList = document.getElementById('party-list');
    partyList.innerHTML = '';
    
    state.parties.forEach((party) => {
      const li = document.createElement('li');
      li.innerHTML = `
        <h3>${party.name}</h3>
        <p><strong>Location:</strong> ${party.location}</p>
        <p><strong>Date & Time:</strong> ${party.dateTime}</p>
        <p><strong>Description:</strong> ${party.description}</p>
        <button class="delete-btn" data-id="${party.id}">Delete</button>
      `;
      partyList.appendChild(li);
    });
  
    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(button => {
      button.addEventListener('click', (event) => {
        const partyId = event.target.dataset.id;
        deleteParty(partyId);
      });
    });
  }
  
  async function addParty(event) {
    event.preventDefault();
  
    const party = {
      name: document.getElementById('party-name').value,
      location: document.getElementById('party-location').value,
      dateTime: document.getElementById('party-datetime').value,
      description: document.getElementById('party-description').value,
    };
  
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(party),
      });
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error.message);
      }
      state.parties.push(data.data);
      renderParties();
    } catch (error) {
      console.error("Error adding party:", error);
    }
  }
  
  async function deleteParty(partyId) {
    try {
      const response = await fetch(`${API_URL}/${partyId}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error.message);
      }
      state.parties = state.parties.filter(party => party.id !== partyId);
      renderParties();
    } catch (error) {
      console.error("Error deleting party:", error);
    }
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    getParties();
  });
  
  const partyForm = document.getElementById('party-form');
  partyForm.addEventListener('submit', addParty);
  