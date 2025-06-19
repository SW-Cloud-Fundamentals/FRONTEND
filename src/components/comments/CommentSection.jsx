import React, {useEffect, useState} from "react";
import styled from "styled-components";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";
import SentimentDonutChart from "./SentimentDonutChart";

export default function CommentSection({
                                           articleId,
                                           onCommentAdded,
                                           currentUser,
                                           comments,
                                           editContent,
                                           setEditContent,
                                           editingCommentId,
                                           setEditingCommentId,
                                           handleUpdateComment,
                                           handleDeleteComment,
                                           fetchComments,
                                           openMenuId,
                                           toggleMenu,
                                           sentimentData,
                                           isSentimentLoading
                                       }) {
    const policeStats = sentimentData.find(s => s.userRole === "POLICE");
    const userStats = sentimentData.find(s => s.userRole === "USER");
    const hasValidData = (stats) =>
        stats && (stats.positive > 0 || stats.negative > 0 || stats.neutral > 0);
    const [hasTriggeredSentiment, setHasTriggeredSentiment] = useState(false);

    // ✅ 분석 중 상태가 true가 되는 순간만 감지해서 true로 설정
    useEffect(() => {
        if (isSentimentLoading) {
            setHasTriggeredSentiment(true);
        }
    }, [isSentimentLoading]);

    return (
        <Wrapper>
            <h3>댓글</h3>
            <CommentForm
                articleId={articleId}
                onCommentAdded={async () => {
                    await onCommentAdded(); // 기존 props로 받은 콜백
                    setHasTriggeredSentiment(true); // ✅ 분석 다시 시작 플래그 설정
                }}
            />

            <ChartWrapper>
                {/* 댓글 없고 분석도 안 돌고 차트도 없으면 이 메시지 */}
                {!isSentimentLoading && sentimentData.length === 0 && comments.length === 0 && (
                    <p style={{textAlign: "center", margin: "10px 0"}}>📝 분석할 의견이 없습니다.</p>
                )}
                {/* 분석중 텍스트는 항상 상단에 */}
                {isSentimentLoading && hasTriggeredSentiment && (
                    <p style={{textAlign: "center", margin: "10px 0"}}>⚙️ 의견 분석 중입니다...</p>
                )}

                {/* 이전 감정 분석 결과가 유효하면 항상 차트 표시 */}
                {(hasValidData(policeStats) || hasValidData(userStats)) && (
                    <ChartRow>
                        {hasValidData(policeStats) && (
                            <ChartContainer>
                                <ChartTitle>경찰 댓글 통계</ChartTitle>
                                <SentimentDonutChart stats={policeStats}/>
                            </ChartContainer>
                        )}
                        {hasValidData(userStats) && (
                            <ChartContainer>
                                <ChartTitle>일반 댓글 통계</ChartTitle>
                                <SentimentDonutChart stats={userStats}/>
                            </ChartContainer>
                        )}
                    </ChartRow>
                )}
            </ChartWrapper>


            <TwoColumnWrapper>
                <div className="column left">
                    {comments.filter(c => c.parentId == null && c.role === "POLICE").map(comment => (
                        <CommentItem
                            key={comment.id}
                            comment={comment}
                            currentUser={currentUser}
                            editContent={editContent}
                            setEditContent={setEditContent}
                            editingCommentId={editingCommentId}
                            setEditingCommentId={setEditingCommentId}
                            handleUpdateComment={handleUpdateComment}
                            handleDeleteComment={handleDeleteComment}
                            comments={comments}
                            fetchComments={fetchComments}
                            articleId={articleId}
                            onCommentAdded={onCommentAdded}
                            openMenuId={openMenuId}
                            toggleMenu={toggleMenu}
                        />
                    ))}
                </div>
                <div className="column right">
                    {comments.filter(c => c.parentId == null && c.role === "USER").map(comment => (
                        <CommentItem
                            key={comment.id}
                            comment={comment}
                            currentUser={currentUser}
                            editContent={editContent}
                            setEditContent={setEditContent}
                            editingCommentId={editingCommentId}
                            setEditingCommentId={setEditingCommentId}
                            handleUpdateComment={handleUpdateComment}
                            handleDeleteComment={handleDeleteComment}
                            comments={comments}
                            fetchComments={fetchComments}
                            articleId={articleId}
                            onCommentAdded={onCommentAdded}
                            openMenuId={openMenuId}
                            toggleMenu={toggleMenu}
                        />
                    ))}
                </div>
            </TwoColumnWrapper>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    margin-top: 40px;
`;

const TwoColumnWrapper = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-top: 20px;

    .column {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .left {
        align-items: flex-start;
    }

    .right {
        align-items: flex-end;
    }

    @media (max-width: 768px) {

        .left {
            align-items: flex-start;
        }

        .right {
            align-items: flex-end;
        }
    }
`;

const ChartWrapper = styled.div`
    background: rgba(255, 255, 255, 0.6);
    padding: 10px;
    border-radius: 16px;
    backdrop-filter: blur(6px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    margin: 30px 0;
    overflow-x: hidden; // ✅ 추가
`;


const ChartRow = styled.div`
    display: flex;
    justify-content: center;
    gap: 40px;
    flex-wrap: wrap;
    margin: 0 0 10px;
    @media (max-width: 768px) {
        gap: 12px;
        justify-content: space-between;
        align-items: flex-start;
        flex-wrap: wrap;       // ✅ 한 줄로 다 안 들어가면 자동 줄바꿈
        overflow-x: hidden;    // ✅ 스크롤 방지
    }
`;


const ChartContainer = styled.div`
    flex: 1;
    min-width: 200px;
    display: flex;
    flex-direction: column;
    align-items: center;
    @media (max-width: 768px) {
        width: 45vw;         // ✅ 한 줄 2개 배치
        min-width: 160px;    // ✅ 너무 커지지 않도록 제한
    }
`;


const ChartTitle = styled.div`
    font-size: 1rem;
    font-weight: bold;
    text-align: center;

    @media (max-width: 480px) {
        font-size: 0.95rem;
    }
`;