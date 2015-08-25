$(document).ready(function () {

  $.ajax({
    url: '/ajax/contacts/',
    method: 'GET',
    success: function (data, status, xhr) {
      if (data && data.contacts && data.contacts.forEach) {
        data.contacts.forEach(function (contact) {
          $('#contactsTable').append('<tr><td>' + contact.name + '</td><td>' + contact.email + '</td></tr>');
        });
      }
    },
    error: function (xhr, status, err) {
      alert(xhr.responseText);
    }
  });

});
