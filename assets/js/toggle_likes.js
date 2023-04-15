
class ToggleLike{

    constructor(toggleElement){
        this.toggler = toggleElement;
        this.toggleLike();
    }

    toggleLike(){
        $(this.toggler).click(function(e){
            e.preventDefault();
            let self = this;

            $.ajax({
                type: 'POST',
                url: $(self).attr('href'),
            })
            .done(function(data) {
                console.log(data);
                let likesCount = parseInt($(self).attr('data-likes'));
                console.log(likesCount);
                if(data.data.deleted == true){
                    likesCount -= 1;

                    new Noty({
                        theme: 'relax',
                        text: "Dislike!",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();
                }else{
                    likesCount += 1;
                    new Noty({
                        theme: 'relax',
                        text: "Like!",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();
                }

                $(self).attr('data-likes',likesCount);
                $(self).html(`${likesCount} Likes`);
            })
            .fail(function(errData){
                console.log('error in completing the request');
            });
        });
    }


}

// class ToggleLike {

//     constructor(toggleElement) {
//         this.toggler = toggleElement;
//         this.toggleLike();
//     }

//     toggleLike() {
//         // Use arrow function to maintain scope of 'this'
//         $(this.toggler).click((e) => {
//             e.preventDefault();
//             let self = this;

//             $.ajax({
//                 type: 'POST',
//                 url: $(self.toggler).attr('href'), // Use 'self.toggler' instead of 'this'
//             })
//             .done(function(data) {
//                 let likesCount = parseInt($(self.toggler).attr('data-likes')); // Use 'self.toggler' instead of 'this', and fix syntax error
//                 console.log(likesCount);
//                 if (data.deleted == true) { // Remove '.data' from 'data.data.deleted'
//                     likesCount -= 1; // Fix syntax error and increment like count
//                 } else {
//                     likesCount += 1; // Decrement like count
//                 }

//                 $(self.toggler).attr('data-likes', likesCount);
//                 $(self.toggler).html(`${likesCount} Likes`);
//             })
//             .fail(function(errData) {
//                 console.log('error in completing the request');
//             });
//         });
//     }
// }