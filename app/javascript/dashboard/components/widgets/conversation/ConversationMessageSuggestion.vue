<script>
export default {
    props: {
        open: Boolean,
        default: false
    }
}
</script>
<template>
    <div v-if="open" class="conversation-message-suggestion">
        <h3>{{ $t('CONVERSATION.REPLYBOX.SUGGESTION') }}</h3>
        <hr class="separator"/>
        <div class="flex flex-col gap-2">
            <div class="bg-primary py-1 px-2 rounded-md cursor-pointer">
                <small>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Labore consectetur vero dolorum</small>
            </div>
            <div class="bg-primary py-1 px-2 rounded-md cursor-pointer">
                <small>ipsum dolor amet consectetur. Labore consectetur vero dolorum</small>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .conversation-message-suggestion {
        z-index: 10;
        width: 350px;
        padding: 8px 20px 8px 8px;
        box-shadow: -1px 0px 3px -2px gray;
        overflow-y: auto;
    }
    .separator{
        margin: 12px 0;
    }
    .bg-primary {
        background-color: hsl(209 100% 60.6% / 1);
        color: white;
        padding: 5px 8px;
    }
    .bg-primary:hover{
        transition: 500ms background-color;
        background-color: #368ddf;
    }
</style>