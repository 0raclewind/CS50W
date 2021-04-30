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
  document.querySelector('#compose-view h3').innerHTML = "New Email";
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
    .then(() => {
      load_mailbox('sent');
    })
  localStorage.clear();
  return false;
}

function display_mailbox(email, mailbox, mailList) {
  // Create elements
  let tr = document.createElement('tr');
  let mailIcon = document.createElement('td');
  let senderTd = document.createElement("td");
  let subjectTd = document.createElement("td");
  let timeTd = document.createElement("td");
  let archiveIcon = document.createElement("td");

  // Set attributes
  tr.classList.add("tableRow");
  mailIcon.classList.add("mail-icon")
  senderTd.classList.add("senderTd");
  subjectTd.classList.add("subjectTd");
  timeTd.classList.add("timeTd");
  archiveIcon.classList.add("archive-icon");

  // Set element values
  if (mailbox === "inbox") {
    if (email.read) {
      mailIcon.innerHTML = "<i class='fas fa-envelope-open'></i>";
      tr.classList.remove("email-unopened");
    } else {
      mailIcon.innerHTML = "<i class='fas fa-envelope'></i>";
      tr.classList.add("email-unopened");
    }
    senderTd.innerHTML = email.sender;
    archiveIcon.innerHTML = '<i class="fas fa-archive"></i>';
  } else if (mailbox === "sent") {
    mailIcon.innerHTML = "<i class='fas fa-paper-plane'></i>";
    senderTd.innerHTML = email.recipients[0];
  } else {
    mailIcon.classList.remove("mail-icon");
    senderTd.innerHTML = email.sender;
    senderTd.style.paddingLeft = "10px";
    archiveIcon.innerHTML = '<i class="fas fa-archive"></i>';
  }

  subjectTd.innerHTML = email.subject;
  timeTd.innerHTML = email.timestamp;

  // Append children
  tr.appendChild(mailIcon);
  tr.appendChild(senderTd);
  tr.appendChild(subjectTd);
  tr.appendChild(timeTd);
  tr.appendChild(archiveIcon);
  mailList.appendChild(tr);

  let open_mail_triggers = [senderTd, subjectTd, timeTd];

  open_mail_triggers.forEach(trigger => {
    trigger.addEventListener('click', () => view_email(email.id, mailbox));
  });
  archiveIcon.addEventListener('click', () => archive_email(email.id, email.archived));
}

function view_email(email_id, mailbox) {
  document.querySelector("#backdrop").style.display = "block";
  document.querySelector("#view-email").style.transform = "translate(-50%, -50%) scale(1)";
  let read = false;

  fetch(`/emails/${email_id}`)
    .then(response => response.json())
    .then(email => {
      document.querySelector('#view-email .time').innerHTML = email.timestamp;
      document.querySelector('#view-email #subject span').innerHTML = email.subject;
      document.querySelector('#view-email #body').innerHTML = email.body.replace(/\n/g, '<br>\n');
      console.log(email.body);

      // Check if email is read, if it's not mark as read and reload mailbox
      if (mailbox === "inbox" && !email.read) {
        fetch(`/emails/${email_id}`, {
          method: 'PUT',
          body: JSON.stringify({
            read: true
          })
        })
          .then(() => load_mailbox('inbox'))
      }

      // If mailbox is sent then load recipients
      if (mailbox === "sent") {
        document.querySelector('#view-email #from').innerHTML = `<strong>To: </strong>${email.recipients[0]}`;
        document.querySelector("#view-email .buttons").innerHTML = '';
      } else {
        document.querySelector('#view-email #from').innerHTML = `<strong>From: </strong>${email.sender}`;
        document.querySelector("#view-email .buttons").innerHTML = '<div id="reply-btn"><i class="fas fa-reply"></i> Reply</div>';
      }

      // Check if mailbox are not "sent", then add event listener to Reply button
      if (mailbox != "sent") {
        document.querySelector('#reply-btn').addEventListener('click', () => {
          hide_email();
          compose_email();
          let subject = '';
          if (email.subject.substring(0, 3) === "Re:") {
            subject = email.subject;
          } else {
            subject = `Re: ${email.subject}`;
          }

          let body = `\n\n"On ${email.timestamp} ${email.sender} wrote:"\n${email.body}`;

          document.querySelector('#compose-view h3').innerHTML = "Reply Email";
          document.querySelector('#compose-recipients').value = email.sender;
          document.querySelector("#compose-subject").value = subject;
          document.querySelector("#compose-body").value = body;
        });
      }
    })

  document.querySelector("#backdrop").addEventListener('click', () => hide_email());
  document.querySelector("#close").addEventListener('click', () => hide_email());
  return false;
}

function hide_email() {
  document.querySelector("#backdrop").style.display = "none";
  document.querySelector("#view-email").style.transform = "translate(-50%, -50%) scale(0)";
}

function archive_email(email_id, status) {
  fetch(`/emails/${email_id}`, {
    method: 'PUT',
    body: JSON.stringify({
      archived: !status
    })
  })
    .then(() => load_mailbox('inbox'))
}