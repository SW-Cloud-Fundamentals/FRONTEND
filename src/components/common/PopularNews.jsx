import React, {useEffect, useState} from "react";
import styled from "styled-components";
import {useNavigate} from "react-router-dom";
import NewsCard from "./NewsCard.jsx";

function PopularNews() {
    const [rankedArticles, setRankedArticles] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRankedArticles = async () => {
            try {
                const rankRes = await fetch("https://crimearticle.net/article-service/rank");
                const json = await rankRes.json();
                console.log("🔥 랭킹 응답:", json);
                let rankIds = [];
                if (Array.isArray(json)) {
                    rankIds = json;
                }

                const articlePromises = rankIds.map((id) =>
                    fetch(`https://crimearticle.net/article-service/news/${id}`).then((res) => res.json())
                        .then((json) => json.data)
                );

                const articles = await Promise.all(articlePromises);
                setRankedArticles(articles);

                console.log(articles)
            } catch (error) {
                console.error("인기 뉴스 불러오기 실패:", error);
            }
        };

        fetchRankedArticles();
    }, []);

    return (
        <Wrapper>
            <h2>실시간 인기 뉴스</h2>
            <CardGrid>
                {rankedArticles.map((article, idx) => (
                    <div key={article.id} onClick={() => navigate(`/articles/${article.id}`)}>
                        <NewsCard news={article} rank={idx}/>
                    </div>
                ))}
            </CardGrid>
        </Wrapper>
    );
}

export default PopularNews;

const Wrapper = styled.div`
    padding: 3rem 2rem;
    background: white;
    width: 100%;
    margin: 0 auto;
    max-width: 1600px; // 💡 충분히 넓게
    height: 100vh; // 💡 한 화면 안에 다 보이도록 고정
    box-sizing: border-box;

    h2 {
        font-size: 1.5rem;
        margin-bottom: 1.5rem;
        font-weight: bold;
        text-align: left;
        padding: 0 2rem;
    }
`;


const CardGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(5, 1fr); // 5열
    grid-template-rows: repeat(2, 1fr); // 2행
    gap: 16px;
    height: calc(100vh - 120px); // 💡 상단 padding, 제목 고려
    padding: 0 2rem;
    box-sizing: border-box;
`;
