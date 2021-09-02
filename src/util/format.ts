import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

interface formatedDataProps {
    newDate?: string;
}

interface readingTimeProps {
    content: {
        heading: string;
        body: {
            text: string;
        }[];
    }[];
}

export function formatedData(props: formatedDataProps) {

    var data = format(
        new Date(props.newDate),
        "d MMM yyy", {
        locale: ptBR,
    }
    );

    var words = data.toLowerCase().split(" ");
    for (var a = 0; a < words.length; a++) {
        var w = words[a];
        words[a] = w[0].toUpperCase() + w.slice(1);
    }
    return words.join(" ");
}

export function formatedDataTime(props: formatedDataProps) {

    var data = format(
        new Date(props.newDate),
        "d MMM yyy', às' HH:mm", {
        locale: ptBR,
    }
    );

    var words = data.toLowerCase().split(" ");
    for (var a = 0; a < words.length; a++) {
        var w = words[a];
        if (words[a] !== 'às') {
            words[a] = w[0].toUpperCase() + w.slice(1);
        }
    }
    return words.join(" ");
}

export function readingTime(props: readingTimeProps) {
    const totalWords = props.content.reduce((total, contentItem) => {

        if (contentItem.heading === null) {
            total += 0;
        } else {
            total += contentItem.heading.split(' ').length;
        }
        const words = contentItem.body.map(item => item.text ? item.text.split(' ').length : 0);

        words.map(word => (total += word));

        return total;
    }, 0);

    const readTime = Math.ceil(totalWords / 200);

    return readTime;
}