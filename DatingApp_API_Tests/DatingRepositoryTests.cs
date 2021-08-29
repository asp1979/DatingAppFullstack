using System;
using System.Threading.Tasks;
using Xunit;
using Moq;
using DatingApp_API.Data;
using DatingApp_API.Models;

namespace DatingApp_API_Tests
{
    public class DatingRepositoryTests
    {
        private Mock<IDatingRepository> _datingRepoMock = new Mock<IDatingRepository>();

        [Fact]
        public async Task GetUser_ShouldReturnUser_WhenUserExists()
        {
            // Arrange
            var user = new User { ID = 1, Username = "Eddy" };
            _datingRepoMock.Setup(x => x.GetUser(user.ID)).ReturnsAsync(user);
            // Act
            var result = await _datingRepoMock.Object.GetUser(user.ID);
            // Assert
            Assert.Equal(user.ID, result.ID);
            Assert.Equal(user.Username, result.Username);
        }
    }
}
