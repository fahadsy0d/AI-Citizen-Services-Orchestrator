
"""Create and seed the local schemes catalog used by the workflow.
This should be called explicitly before the workflow is used in a real app.
The database bootstrap is intentionally kept out of module import side effects
so the file can be safely imported by FastAPI startup code or tests.
"""

from pathlib import Path
import sqlite3 as sq

DB_PATH = Path(__file__).with_name("citizen_state.db")


def initialize_database(db_path: str | Path = DB_PATH) -> None:
    """Create the SQLite database and seed it with mock government schemes."""
    with sq.connect(db_path) as conn:
        cursor = conn.cursor()
        cursor.execute("DROP TABLE IF EXISTS schemes")
        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS schemes (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    category TEXT NOT NULL,
                    year_established TEXT,
                    target_audience TEXT,
                    time_to_apply TEXT,
                    description TEXT,
                    eligibility_criteria TEXT,
                    required_documents TEXT
                )
                """
            )

        mock_schemes = [
                (
                    "PM Unemployment Relief Allowance",
                    "Employment",
                    "2021",
                    "Recently unemployed citizens actively seeking work",
                    "10 mins online via portal",
                    "Monthly financial support for up to 6 months.",
                    "Unemployed, actively seeking work, under 65 years old",
                    "Proof of unemployment, ID, Bank statement",
                ),
                (
                    "National Skill Development Program",
                    "Employment",
                    "2018",
                    "Citizens seeking reskilling or job placement",
                    "5 mins online",
                    "Free professional training courses with certification",
                    "Citizens seeking reskilling or job placement, 18-60 years old",
                    "ID, Proof of residence",
                ),
                (
                    "PM Business Starter Grant",
                    "Business",
                    "2020",
                    "First-time entrepreneurs and small business owners",
                    "30 mins + document verification",
                    "Low-interest seed capital loans for small businesses.",
                    "First-time entrepreneurs, new business idea",
                    "Business plan, ID, Bank statement",
                ),
            ]

        cursor.executemany(
                """
                INSERT INTO schemes (
                    name,
                    category,
                    year_established,
                    target_audience,
                    time_to_apply,
                    description,
                    eligibility_criteria,
                    required_documents
                )
                VALUES (?,?,?,?,?,?,?,?)
                """,
                mock_schemes,
            )
        conn.commit()


if __name__ == "__main__":
    initialize_database()
    print("Database initialized successfully.")