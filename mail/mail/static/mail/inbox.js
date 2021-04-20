document.addEventListener('DOMContentLoaded', function () {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archive').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  document.querySelector('#compose-form').onsubmit = send_email;
  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {

  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  let buttons = document.querySelectorAll(".mailbox-buttons a");
  let emailsView = document.querySelector("#emails-view");
  let mailList = document.createElement('table');
  mailList.id = "mail-list";
  emailsView.appendChild(mailList);

  buttons.forEach(button => {
    button.style.color = "#666";
    button.style.borderBottom = "3px solid transparent";
    if (button.id === mailbox) {
      button.style.color = "#1e90ff";
      button.style.borderBottom = '3px solid #1e90ff';
    }
  });

  fetch(`/emails/${mailbox}`)
    .then(response => response.json())
    .then(emails => {
      emails.forEach(email => display_mailbox(email, mailbox, mailList))
    });
}

function send_email() {
  // Set email variables
  const recipients = document.querySelector('#compose-recipients').value;
  const subject = document.querySelector('#compose-subject').value;
  const body = document.querySelector('#compose-body').value;

  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
      recipients: recipients,
      subject: subject,
      body: body
    })
  })
  localStorage.clear();
  load_mailbox('inbox');
  return false;
}

function display_mailbox(email, mailbox, mailList) {
  // Create elements
  let tr = document.createElement('tr');
  let senderTd = document.createElement("td");
  let subjectTd = document.createElement("td");
  let timeTd = document.createElement("td");

  // Set attributes
  tr.classList.add("tableRow");
  senderTd.classList.add("senderTd");
  subjectTd.classList.add("subjectTd");
  timeTd.classList.add("timeTd");

  // Set element values
  senderTd.innerHTML = email.sender;
  subjectTd.innerHTML = email.subject;
  timeTd.innerHTML = email.timestamp;

  // Append children
  tr.appendChild(senderTd);
  tr.appendChild(subjectTd);
  tr.appendChild(timeTd);
  mailList.appendChild(tr);

  console.log(email);
}