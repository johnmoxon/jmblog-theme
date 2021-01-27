
export default {

    // 
    move: function ( commentId, respondId, postId, parentUid ) {

        // @TODO: postID is currently unused, check before production

        let div, element, style, cssHidden, t = this;
        this.commentEl = document.getElementById( commentId ); // whole comment
        this.respondEl = document.getElementById( respondId ); // whole new comment form

        this.cancelEl  = document.getElementById( 'cancel-comment-reply-link' ); // whole cancel reply link 
        this.parentUidF = document.getElementById( 'comment-replying-to-uid' ); // hidden field to dynamically add comment id to
        // this.post      = document.querySelector( '.comment-post-slug' );

        // @TODO: Delete this line unless there is good reason to store a link to the form
        // this.commentForm = this.respondEl.querySelector( 'form' ); //the form part of comment form...

        // Check that all required params have been passed and are accessible
        if (!this.commentEl || !this.respondEl || !this.cancelEl || !this.parentUidF  ) {
            // console.log('something not passed');
            return false;
        }

        // Create a temp div if its not already there and place before comments form.. 
        // Will be used as a bookmark placeholder to return the form to its original place
        if ( !document.querySelector( '#sm-temp-form-div' ) ) {
            this.respondBookmark = document.createElement( 'div' );
            this.respondBookmark.id = 'sm-temp-form-div';
            this.respondBookmark.classList.add('is-hidden');
            this.respondEl.parentNode.insertBefore(this.respondBookmark, this.respondEl );
        }

        // move the form to below the comment being replied to
        this.commentEl.parentNode.insertBefore(this.respondEl, this.commentEl.nextSibling );
        // set the replying uid field
        this.parentUidF.value = parentUid;
        // unhide the cancel button
        this.cancelEl.classList.toggle('is-hidden');
        // focus on the first field in the form
        this.respondEl.querySelector('.comments-field').focus();

        // Attach the cancel event listener - once only
        if ( ! t.cancelEl.dataset.eventAttached ) {
            console.log('event attached to cancel');
            t.cancelEl.addEventListener('click', function(evt){
                evt.preventDefault();
                t.cancelEl.dataset.eventAttached = true;
                t.snapback();
            });

        }

    },

    snapback: function() {
        // move the form back to the original location
        this.respondBookmark.parentNode.insertBefore( this.respondEl, this.respondBookmark );
        // clear the replying_to_comment field & reset the form
        this.parentUidF.value = null;
        // reset the form
        this.respondEl.querySelector('form').reset();
        // toggle off the cancel button
        this.cancelEl.classList.toggle('is-hidden');

    }


}
