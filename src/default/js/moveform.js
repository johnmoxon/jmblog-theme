
export default {

    // 
    move: function ( commentId, respondId, postId, parentId ) {


        console.log("RAW PARAMS");
        console.log("commentId", commentId);
        console.log("respondId", respondId);
        console.log("postId", postId);
        console.log("parentId", parentId);

        let div, element, style, cssHidden;
        this.commentEl = document.getElementById( commentId ); // whole comment
        this.respondEl = document.getElementById( respondId ); // whole new comment form
        console.log("Got here ln17");
        console.log("this.commentEl", this.commentEl);
        console.log("this.respondEl", this.respondEl);

        // this.cancelEl  = this.respondEl.querySelector( '.cancel-comment-reply-link' ); // whole cancel reply link 
        this.parentUidF = document.getElementById( 'comment-replying-to-uid' ); // hidden field to dynamically add comment id to
        // this.post      = document.querySelector( '.comment-post-slug' );
        // this.commentForm = this.respondEl.querySelector( 'form' ); //the form part of comment form...

        // Check that all required params have been passed and are accessible
        // if (!this.commentEl || !this.respondEl || !this.cancelEl || !this.parentUidF || !this.commentForm ) {
        //     console.log('something not passed');
        //     return false;
        // }

        // t.respondId = respondId;
        // postId = postId || false;

        // Create a temp div if its not already there and place before comments form.. 
        if ( !document.querySelector( '#sm-temp-form-div' ) ) {
            let tmpDiv = document.createElement( 'div' );
            tmpDiv.id = 'sm-temp-form-div';
            tmpDiv.classList.add('is-hidden');
            this.respondEl.parentNode.insertBefore(tmpDiv, this.respondEl );
        }

        // find the parent node of the comment article and move the form to above the next sibling
        this.commentEl.parentNode.insertBefore(this.respondEl, this.commentEl.nextSibling );

    },

    snapback: function() {
        window.cc = this;
    }


}
