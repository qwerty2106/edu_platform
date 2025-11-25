import React from "react";
import { connect } from "react-redux";
import { getWorks, getWorksCount, getWorksLoading } from "../../redux/works-selector";
import { requestWorks } from "../../redux/works-reducer";
import Preloader from "../../common/Preloader";
import Work from "./Work";
import MyPagination from "../../common/Pagination";
import withRouter from "../../common/WithRouter";
import { withWorkListRedirect } from "../../hoc/withWorkListRedirect";
import { getUser } from "../../redux/auth-selectors";

class WorkContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = { pageSize: 3, page: 1 };
    }
    componentDidMount() {
        this.loadWorks();
    }
    loadWorks = () => {
        const { userID } = this.props.router.params;
        this.props.requestWorks(userID, this.state.page, this.state.pageSize);
        console.log(this.props.worksCount)
    }
    onPageChangeHandle = (page) => {
        this.setState({ page }, () => this.loadWorks());
    }
    render() {
        if (this.props.isLoading)
            return <Preloader />

        if (this.props.works.length === 0)
            return <h1>No works yet!</h1>

        const worksElements = this.props.works.map((work, index) => <Work key={index} {...work} />)

        return (
            <div>
                <MyPagination
                    itemsCount={this.props.worksCount}
                    pageSize={this.state.pageSize}
                    currentPage={this.state.page}
                    onPageChange={this.onPageChangeHandle} />
                {worksElements}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        works: getWorks(state),
        isLoading: getWorksLoading(state),
        worksCount: getWorksCount(state),
        user: getUser(state),
    }
}


export default withRouter(connect(mapStateToProps, { requestWorks })(withWorkListRedirect(WorkContainer)));