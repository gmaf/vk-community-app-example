var app = {
  APP_ID: 6287587,
  API_VERSION: '5.69',
  API_SETTINGS_SCOPE_PHOTOS: 4,
  PAGES: {
    INSTALL: document.getElementById('page-install'),
    START: document.getElementById('page-start'),
    PICK_PHOTO: document.getElementById('page-pick_photo'),
    ENTER_DESCRIPTION: document.getElementById('page-enter_text')
  },
  show: function(page) {
    app.hideAll();
    page.style.display = 'block';

    if (page == app.PAGES.PICK_PHOTO) {

      var requestData = {
        "owner_id": sessionStorage.getItem('viewer_id'),
        "count": 5,
        "skip_hidden": 1
      };

      var list = document.createElement('ul');
          list.classList.add('list-photo');

      VK.api("photos.getAll", requestData, function(data) {
        console.log(data);

        for(let elem in data.response.items){
            let liElem = document.createElement('li');
            let imgElem = document.createElement('img');

            imgElem.src = data.response.items[elem].photo_130;
            imgElem.photoid = data.response.items[elem].photo_604;
            imgElem.onclick = app.onPhotoPicked;

            liElem.appendChild(imgElem);

            list.appendChild(liElem);
        }

        app.PAGES.PICK_PHOTO.appendChild(list);

      });

    }
  },
  onPhotoPicked: function(event){
    event.preventDefault();

    app.show(app.PAGES.ENTER_DESCRIPTION);

    document.getElementById('btn-submit')
            .addEventListener('click', function(e){
              e.preventDefault();

              VK.callMethod("shareBox",
                            "https://vk.com/app" + app.APP_ID,
                            event.target.photoid,
                            document.getElementById('textarea-description').value);

              // var requestData = {
              //   "owner_id": sessionStorage.getItem('viewer_id'),
              //   "message": document.getElementById('textarea-description').value,
              //   "attachments": "photo" + sessionStorage.getItem('viewer_id') +
              //                   "_" + event.target.photoid + "," + "https://vk.com/app" + app.APP_ID
              // };
              //
              // VK.api("wall.post", requestData, function(data){
              //     console.log(data);
              // });
            });
  },
  hideAll: function() {
    for (var i in app.PAGES)
      app.PAGES[i].style.display = 'none';
  },
  init: function(){
    document.getElementById('btn-include-app')
            .href = 'https://vk.com/add_community_app?aid=' + app.APP_ID;

    VK.init(null, null, app.API_VERSION);

    var queryString = window.location.href;

    sessionStorage.setItem('viewer_id',
                          getQueryItemValue(queryString, 'viewer_id'));
    sessionStorage.setItem('viewer_id',
                          getQueryItemValue(queryString, 'viewer_id'));


    if (getQueryItemValue(queryString, 'group_id') == 0) {
      app.show(app.PAGES.INSTALL);
    } else {
      app.show(app.PAGES.START);
    }


    document.getElementById('btn-get-access')
            .addEventListener('click', function(e) {

      e.preventDefault();
      VK.callMethod('showSettingsBox', app.API_SETTINGS_SCOPE_PHOTOS); // Доступ к фотографиям

      VK.addCallback('onSettingsChanged', onSuccess);

      function onSuccess() {
        VK.removeCallback('onSettingsChanged', onSuccess);
        app.show(app.PAGES.PICK_PHOTO);
      }
    });

    function getQueryItemValue(str, item) {
      item += '=';

      var position = str.indexOf(item);

      if (position == -1) return 0;

      var id = str.substr(position + item.length);
      id = id.split('&')[0];

      return id;
    }
  }
};

window.addEventListener('load', function() {
  app.init();
});
