import { useEffect, useState } from 'react';

export const useUtterances = (commentNodeId) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        if (!visible) return;
        const script = document.createElement('script');
        script.src = 'https://utteranc.es/client.js';
        script.async = true;
        script.setAttribute('repo', 'gabriellopesglp/desafio-05-trilha-reactjs');
        script.setAttribute('issue-term', 'pathname');
        script.setAttribute('label', 'comment :speech_balloon:');
        script.setAttribute('theme', 'github-dark-orange');
        script.setAttribute('crossorigin', 'anonymous');

        const scriptParentNode = document.getElementById(commentNodeId);
        scriptParentNode.appendChild(script);

        return () => {
            scriptParentNode.removeChild(scriptParentNode.firstChild);
        };
    }, [visible]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setVisible(true);
                    }
                });
            },
            {
                threshold: 1,
            }
        );
        observer.observe(document.getElementById(commentNodeId));
    }, [commentNodeId]);
};