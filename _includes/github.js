
function GithubRepository(user, repository) {
  this.user = user;
  this.repository = repository;
  this.githubRepository = user + "/" + repository;
}


GithubRepository.prototype.getAssetName = function() {
  var split_path = document.location.pathname.split("/");
  return split_path[split_path.length - 1];
}

GithubRepository.prototype.redirectToReleaseFile = function(release) {
  console.log(release);
  var assetName = this.getAssetName();
  console.log("Looking for asset: " + assetName)
  var downloaded = false;
  for (var i = 0; i < release.assets.length; i+=1) {
    var asset = release.assets[i];
    if (asset.name == assetName) {
      downloadAsset(asset.browser_download_url);
      downloaded = true;
    }
  }
  if (!downloaded) {
    couldNotDownloadAsset(release);
  }
}

GithubRepository.prototype.startDownload = function () {
  var httpreq = new XMLHttpRequest();
  var repository = this;
  httpreq.open("GET", "https://api.github.com/repos/" + this.githubRepository + "/releases/latest", true);
  httpreq.onload = function(e) {
    if (httpreq.readyState === 4) {
      if (httpreq.status === 200) {
        repository.redirectToReleaseFile(JSON.parse(httpreq.responseText));
      } else {
        console.error(httpreq.statusText);
      }
    }
  }
  httpreq.onerror = function(e) {
    console.error(httpreq.statusText);
  }
  httpreq.send(null);
}
