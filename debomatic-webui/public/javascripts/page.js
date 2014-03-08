var Page = {

  title: {
    set: function(data) {
      if (! data)
        data = Utils.from_hash_to_data()
      label = ''
      if (Utils.check_data_file(data))
        label = data.package.orig_name + '.' + data.file.name
      else if (Utils.check_data_package(data))
        label = data.package.orig_name
      else if (Utils.check_data_distribution(data))
        label = data.distribution.name
      $('#title').html(label)
    },
    clean: function() {
      $('#title').html('')
    }
  },

  packages: {
    set: function (data) {
      $('#packages ul').html('')
      tmp = data
      tmp.file = null
      data.distribution.packages.forEach(function(p){
        tmp.package = p
        $('#packages ul').append('<li id="package-' + p.orig_name + '"><a href="' + Utils.from_data_to_hash(tmp) + '">'+ p.name + ' <span>'+p.version+'</span></a></li>')
      })
    },
    
    clean: function () {
      $('#packages ul').html('')
    },
    get: function (data) {
      if (! data)
        data = Utils.from_hash_to_data()
      if (Utils.check_data_distribution(data))
        socket.emit("get_distribution_packages", data)
    }
  },

  files: {
    set: function (data) {
      Page.files.clean()
      tmp = data
      if (data.package.files) {
        selected_file = Utils.check_data_file(data)
        data.package.files.forEach(function(f){
          tmp.file = f
          $('#logs ul').append('<li id="file-'+ f.orig_name +'"><a title="'+ f.orig_name +'" href="'+ Utils.from_data_to_hash(tmp) + '">' + f.name + '</a></li>')
        })
      }
      
      if (data.package.debs) {
        data.package.debs.forEach(function(f){
          $('#debs ul').append('<li><a title="'+ f.orig_name +'" href="' + f.path + '">' + f.name  +'</a> <span>.' + f.label + '</span></li>')
        })
      }
      
      if (data.package.archives) {
        data.package.archives.forEach(function(f){
          $('#archives ul').append('<li><a title="'+ f.orig_name +'" href="' + f.path + '">' + f.name  +'</a></li>')
        })
      }
      $('#files').show()
    },
    clean: function() {
      $('#logs ul').html('');
      $('#debs ul').html('');
      $('#archives ul').html('')
      $('#files').hide()
    },
    get: function (data) {
      if (! data)
        data = Utils.from_hash_to_data()
      if (Utils.check_data_package(data))
        socket.emit("get_package_file_list", data)
    }
  },
  
  file: {
    set: function(data) {
      $("#file pre").html(data.file.content)
      $("#file").show()
    },
    clean: function() {
      $('#file pre').html('')
      $('#file').hide()
    },
    append: function(data) {
      new_html =  $("#file pre").html() + data.file.new_content
      $("#file pre").html(new_html)
    },
    get: function(data) {
      if (! data)
        data = Utils.from_hash_to_data()
      if (Utils.check_data_file(data))
        socket.emit("get_file", data)
    }
  },
  
  breadcrumb: {
    update: function(hash) {
      if (! hash )
        hash = window.location.hash
      hash = hash.replace('#', '')
      new_html = ''
      new_hash = '#'
      info = hash.split('/')
      for (var i = 0; i < info.length ; i++) {
        new_hash += info[i]
        if (i == (info.length - 1))
          new_html += '<li class="active">' + info[i] + '</li>'
        else
          new_html += '<li><a href="' + new_hash + '">' + info[i] + '</a>'
        new_hash += '/'
      }
      $('.breadcrumb').html(new_html)
    }
  },
  
  navbar: {
    select: function (data) {
      if (! data)
        data = Utils.from_hash_to_data()

      $('#distributions li').removeClass('active')
      $('#distribution-' + data.distribution.name).addClass('active')
    },
    update: function (distributions) {
      $('#distributions ul').html('');
      distributions.forEach(function (name){
        $('#distributions ul').append('<li id="distribution-' + name +'"><a href="#' + name + '">' + name + '</li>');
      });
      Page.navbar.select()
    },
  },
  
  clean: function() {
    Page.title.clean()
    Page.packages.clean()
    Page.files.clean()
    Page.file.clean()
    Page.navbar.select()
    Page.breadcrumb.update()
  },
  
  update: function(data, old_data) {
    if (! old_data ) {
      if (! data )
        Page.populate()
      else
        Page.populate(data)
      return;
    }
    else {
      if (! Utils.check_data_distribution(old_data) ||
          ! Utils.check_data_distribution(data) ||
          data.distribution.name != old_data.distribution.name) 
      {
        Page.clean()
        Page.populate(data)
      }
      else if (
        ! Utils.check_data_package(old_data) ||
        ! Utils.check_data_package(data) ||
        data.package.orig_name != data.package.orig_name )
      {
        Page.file.clean()
        Page.files.get(data)
      }
      else if (
        ! Utils.check_data_file(old_data) ||
        ! Utils.check_data_file(data) ||
        data.file.name != old_data.file.name
      )
      {
        Page.file.get()
      }
      Page.title.set(data)
      Page.breadcrumb.update()
    }
  },
  
  populate: function (data) {
    Page.clean()
    if (! data )
      data = Utils.from_hash_to_data()
    Page.packages.get(data)
    Page.files.get(data)
    Page.file.get(data)
    Page.navbar.select()
    Page.breadcrumb.update()
    Page.title.set(data)
  }
}