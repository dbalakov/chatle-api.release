// Generated by CoffeeScript 1.6.3
(function() {
  var ChatleClient;

  ChatleClient = (function() {
    function ChatleClient(key, host, transport) {
      this.key = key;
      this.host = host;
      this.transport = transport;
      if (this.key == null) {
        throw new Error('ChatleClient constructor call without api key');
      }
      if (this.host == null) {
        this.host = ChatleClient.DEFAULT_HOST;
      }
      if (this.transport == null) {
        this.transport = new ChatleClient.Transport(this.host, this.key);
      }
      this.auth = new ChatleClient.Auth(this);
      this.rooms = new ChatleClient.Rooms(this);
      this.users = new ChatleClient.Users(this);
    }

    return ChatleClient;

  })();

  ChatleClient.DEFAULT_HOST = 'https://chatle.co/system/widgets/_out/api.html';

  window.ChatleClient = ChatleClient;

}).call(this);
// Generated by CoffeeScript 1.6.3
(function() {
  var Transport;

  Transport = (function() {
    function Transport(frame_url, key) {
      this.frame_url = frame_url;
      this.key = key;
      if (this.frame_url == null) {
        throw new Error('ChatleClient.Transport constructor call without frame_url');
      }
      if (this.key == null) {
        throw new Error('ChatleClient.Transport constructor call without key');
      }
      this.iframe = document.createElement('iframe');
      this.iframe.src = this.frame_url;
      this.iframe.setAttribute('style', 'width:0;height:0;display:none');
      document.body.appendChild(this.iframe);
      this.queue = [];
      this.data = null;
      setInterval(this.interval.bind(this));
    }

    Transport.prototype.interval = function() {
      var hash, result, _base;
      if (this.data != null) {
        hash = this.iframe.src.split('#')[1];
        if ((hash == null) || hash === this.data.hash || hash === '') {
          return;
        }
        result = JSON.parse(hash);
        if (typeof (_base = this.data).callback === "function") {
          _base.callback((result.status === 'ok' ? null : result.errorStatus), (result.status === 'ok' ? result.data : null));
        }
        this.data = null;
      }
      return this.sendCommandToFrame();
    };

    Transport.prototype.sendCommandToFrame = function() {
      if ((this.data != null) || this.queue.length === 0) {
        return;
      }
      this.data = this.queue.shift();
      this.data.hash = JSON.stringify(this.data.command);
      return this.iframe.src = "" + this.frame_url + "#" + this.data.hash;
    };

    Transport.prototype.sendCommand = function(type, url, data, callback) {
      this.queue.push({
        command: {
          type: type,
          url: url,
          data: data,
          headers: {
            "X-AppKey": this.key
          }
        },
        callback: callback
      });
      return this.sendCommandToFrame();
    };

    Transport.prototype.get = function(url, data, callback) {
      return this.sendCommand('GET', url, data, callback);
    };

    Transport.prototype.post = function(url, data, callback) {
      return this.sendCommand('POST', url, data, callback);
    };

    Transport.prototype.put = function(url, data, callback) {
      return this.sendCommand('PUT', url, data, callback);
    };

    Transport.prototype["delete"] = function(url, data, callback) {
      return this.sendCommand('DELETE', url, data, callback);
    };

    return Transport;

  })();

  ChatleClient.Transport = Transport;

}).call(this);
// Generated by CoffeeScript 1.6.3
(function() {
  var Auth;

  Auth = (function() {
    function Auth(client) {
      this.client = client;
      if (this.client == null) {
        throw new Error('ChatleClient.Auth constructor call without client');
      }
    }

    Auth.prototype.registerMobile = function(number, callback) {
      return this.client.transport.get("" + Auth.URL + Auth.REGISTER_MOBILE_URL, {
        number: number
      }, callback);
    };

    Auth.prototype.registerEmail = function(email, callback) {
      return this.client.transport.get("" + Auth.URL + Auth.REGISTER_EMAIL_URL, {
        email: email
      }, callback);
    };

    Auth.prototype.confirmCode = function(confirmation_id, code, display_name, callback) {
      return this.client.transport.get("" + Auth.URL + Auth.CONFIRM_CODE_URL, {
        confirmation_id: confirmation_id,
        code: code,
        display_name: display_name
      }, callback);
    };

    return Auth;

  })();

  Auth.URL = 'api/auth/';

  Auth.REGISTER_MOBILE_URL = 'register_mobile';

  Auth.REGISTER_EMAIL_URL = 'email';

  Auth.CONFIRM_CODE_URL = 'confirm_code';

  ChatleClient.Auth = Auth;

}).call(this);
// Generated by CoffeeScript 1.6.3
(function() {
  var Rooms;

  Rooms = (function() {
    function Rooms(client) {
      this.client = client;
      if (this.client == null) {
        throw new Error('ChatleClient.Rooms constructor call without client');
      }
    }

    Rooms.prototype.list = function(callback) {
      return this.client.transport.get("" + Rooms.URL, null, callback);
    };

    Rooms.prototype.messages = function(room, filter, callback) {
      return this.client.transport.get("" + Rooms.URL + "/" + room, filter, callback);
    };

    Rooms.prototype.sendMessage = function(room, message, callback) {
      return this.client.transport.post("" + Rooms.URL + "/" + room + "/" + Rooms.SEND_MESSAGE_URL, {
        text: message
      }, callback);
    };

    Rooms.prototype.deleteMessage = function(room, message, callback) {
      return this.client.transport["delete"]("" + Rooms.URL + "/" + room + "/" + message, null, callback);
    };

    Rooms.prototype.createPrivate = function(user, group, callback) {
      return this.client.transport.get("" + Rooms.URL + "/" + Rooms.CREATE_PRIVATE_ROOM_URL, {
        user_id: user,
        group: group
      }, callback);
    };

    Rooms.prototype.createInviteOnly = function(users, group, name, callback) {
      return this.client.transport.get("" + Rooms.URL + "/" + Rooms.CREATE_INVITE_ONLY_URL, {
        user_ids: users,
        group: group,
        name: name
      }, callback);
    };

    Rooms.prototype.update = function(room, group, name, mute, data, callback) {
      return this.client.transport.put("" + Rooms.URL + "/" + room, {
        group: group,
        name: name,
        mute: mute,
        data: data
      }, callback);
    };

    Rooms.prototype.invite = function(room, users, callback) {
      var data;
      data = {};
      data[users instanceof Array ? 'user_ids' : 'user'] = users;
      return this.client.transport.get("" + Rooms.URL + "/" + room + "/" + Rooms.INVITE_USERS, data, callback);
    };

    Rooms.prototype.leave = function(room, callback) {
      return this.client.transport.get("" + Rooms.URL + "/" + room + "/" + Rooms.LEAVE, null, callback);
    };

    return Rooms;

  })();

  Rooms.URL = 'api/rooms';

  Rooms.SEND_MESSAGE_URL = 'message';

  Rooms.CREATE_PRIVATE_ROOM_URL = 'private';

  Rooms.CREATE_INVITE_ONLY_URL = 'group';

  Rooms.INVITE_USERS = 'invite';

  Rooms.LEAVE = 'leave';

  ChatleClient.Rooms = Rooms;

}).call(this);
// Generated by CoffeeScript 1.6.3
(function() {
  var Users;

  Users = (function() {
    function Users(client) {
      this.client = client;
      if (this.client == null) {
        throw new Error('ChatleClient.Users constructor call without client');
      }
    }

    Users.prototype.me = function(callback) {
      return this.client.transport.get("" + Users.URL + "/" + Users.ME_URL, null, callback);
    };

    Users.prototype.info = function(id, callback) {
      return this.client.transport.get("" + Users.URL + "/" + id, null, callback);
    };

    Users.prototype.update = function(first_name, last_name, display_name, callback) {
      return this.client.transport.post("" + Users.URL + "/" + Users.UPDATE_URL, {
        first_name: first_name,
        last_name: last_name,
        display_name: display_name
      }, callback);
    };

    return Users;

  })();

  Users.URL = 'api/users';

  Users.ME_URL = 'me';

  Users.UPDATE_URL = 'me';

  ChatleClient.Users = Users;

}).call(this);
