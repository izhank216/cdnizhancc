(function(global){
  function loadBrowserFS(callback){
    if(typeof BrowserFS !== 'undefined') return callback();
    var script = document.createElement('script');
    script.src = "https://cdn.jsdelivr.net/npm/browserfs/dist/browserfs.min.js";
    script.onload = callback;
    script.onerror = function(){ throw new Error("Failed to load BrowserFS from CDN"); };
    document.head.appendChild(script);
  }

  loadBrowserFS(function(){
    BrowserFS.configure({ fs: "IndexedDB", options:{} }, function(err){
      if(err) throw err;
      var fs = BrowserFS.BFSRequire('fs');
      var BrowserDB = {
        _tables: {},
        create(sql){
          var stmt = sql.trim();
          if(stmt.match(/^CREATE TABLE/i)){
            var tableName = stmt.match(/^CREATE TABLE\s+(\w+)/i)[1];
            if(this._tables[tableName]) throw new Error("Table " + tableName + " already exists");
            this._tables[tableName] = [];
            this._saveTable(tableName);
            return;
          }
          if(stmt.match(/^INSERT INTO/i)){
            var m = stmt.match(/^INSERT INTO\s+(\w+)\s*\(([^)]+)\)\s*VALUES\s*\(([^)]+)\)/i);
            if(!m) throw new Error("Invalid INSERT syntax");
            var table = m[1];
            if(!this._tables[table]) throw new Error("Table " + table + " does not exist");
            var cols = m[2].split(',').map(s=>s.trim());
            var vals = m[3].split(',').map(s=>s.trim().replace(/^['"]|['"]$/g,''));
            var row = {};
            cols.forEach((c,i)=> row[c] = vals[i]);
            this._tables[table].push(row);
            this._saveTable(table);
            return;
          }
          if(stmt.match(/^SELECT/i)){
            var table = stmt.match(/FROM\s+(\w+)/i)[1];
            if(!this._tables[table]) throw new Error("Table " + table + " does not exist");
            return this._tables[table];
          }
          throw new Error("Unsupported SQL command in create()");
        },
        remove(sql){
          var stmt = sql.trim();
          if(!stmt.match(/^DELETE FROM/i)) throw new Error("Only DELETE supported in remove()");
          var table = stmt.match(/^DELETE FROM\s+(\w+)/i)[1];
          if(!this._tables[table]) throw new Error("Table " + table + " does not exist");
          this._tables[table] = [];
          this._saveTable(table);
        },
        _saveTable(table){
          fs.writeFile("/"+table+".json", JSON.stringify(this._tables[table]), 'utf8', function(err){
            if(err) console.error("Save error:", err);
          });
        },
        sleep(ms){ return new Promise(resolve => setTimeout(resolve, ms)); }
      };
      global.BrowserDB = BrowserDB;
    });
  });
})(this);
