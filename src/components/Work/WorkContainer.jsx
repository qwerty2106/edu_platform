import React from "react";
import { connect } from "react-redux";
import { getWorks, getWorksCount, getWorksLoading } from "../../redux/works-selector";
import { requestWorks } from "../../redux/works-reducer";
import Preloader from "../../common/Preloader";
import Work from "./Work";
import MyPagination from "../../common/Pagination";
import withRouter from "../../common/WithRouter";
import { getUser } from "../../redux/auth-selectors";
import EmptyScreen from "../../common/EmptyScreen";

class WorkContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = { pageSize: 3, page: 1 };
    }
    componentDidMount() {
        this.loadWorks();
    }
    componentDidUpdate(prevProps, prevState) {
        if (this.props.router.params.userID !== prevProps.router.params.userID || this.state.page !== prevState.page)
            this.loadWorks();
    }
    loadWorks = async () => {
        const { userID } = this.props.router.params;
        const { user } = this.props;
        const result = await this.props.requestWorks(userID, this.state.page, this.state.pageSize);

        if (!result.success && result.error === 403) 
            this.props.router.navigate(`/app/works/${user.id}`, { replace: true });
        
    }
    onPageChangeHandle = (page) => {
        this.setState({ page }, () => this.loadWorks());
    }
    render() {
        if (this.props.isLoading)
            return <Preloader />

        if (this.props.works.length === 0)
            return <EmptyScreen />

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


export default connect(mapStateToProps, { requestWorks })(withRouter(WorkContainer));