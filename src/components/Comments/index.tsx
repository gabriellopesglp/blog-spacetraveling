import { useUtterances } from '../../hooks/useUtterances';

const commentNodeId = 'inject-comments-for-uterances';

const Comments = () => {
    useUtterances(commentNodeId);
    return <div id={commentNodeId} />;
};

export default Comments;