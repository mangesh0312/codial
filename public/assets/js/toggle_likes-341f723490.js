class ToggleLike{constructor(t){this.toggler=t,this.toggleLike()}toggleLike(){$(this.toggler).click((function(t){t.preventDefault();let e=this;$.ajax({type:"POST",url:$(e).attr("href")}).done((function(t){console.log(t);let o=parseInt($(e).attr("data-likes"));console.log(o),1==t.data.deleted?(o-=1,new Noty({theme:"relax",text:"Dislike!",type:"success",layout:"topRight",timeout:1500}).show()):(o+=1,new Noty({theme:"relax",text:"Like!",type:"success",layout:"topRight",timeout:1500}).show()),$(e).attr("data-likes",o),$(e).html(o+" Likes")})).fail((function(t){console.log("error in completing the request")}))}))}}